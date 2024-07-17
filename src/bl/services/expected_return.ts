import { z } from "zod";
import {
    db_expected_return_list,
    db_expected_return_list_by_ticker,
    db_expected_return_list_for_update,
    db_expected_return_update,
    db_expected_return_list_is_data_has,
    db_er_risk_rate_auto_update
} from "../models/expected_return";
import {
    SchemaExpectedReturnFullUpdate,
    SchemaExpectedReturnList,
    SchemaExpectedReturnListByTicker,
    SchemaExpectedReturnRecalculate,
    SchemaExpectedReturnUpdateRiskFree,
    SchemaExpectedReturnUpdateItem,
    SchemaExpectedReturnUpdateRiskFreeByTickers
} from "../schema/expected_return";
import { err400, errConflict, isError, okJson } from "../result";
import { TickerRow } from "../models/tickers";
import { addDays, addMonths, parse } from "date-fns";
import {
    tickersMonthDataFullUpdateService,
    tickersMonthDataListService
} from "./tickers_month_data";
import { indicesForErService } from "./indices";
import { TickersMonthDataRow } from "../models/tickers_month_data";
import { db_notifications_new } from "../models/notifications";
import { KURILENKO_ID, SERGEEV_ID } from "../../utils/users";
import { tickersListService, tickersListServiceByTickersList } from "./tickers";
import { db_tickers_prices_month_list } from "../models/tickers_history";

export function expectedReturnListService(
    app: IApp,
    params: z.infer<typeof SchemaExpectedReturnList>
) {
    return db_expected_return_list(app, params.body);
}

export function expectedReturnListByTickerService(
    app: IApp,
    params: z.infer<typeof SchemaExpectedReturnListByTicker>
) {
    return db_expected_return_list_by_ticker(app, params.query);
}

export async function expectedReturnFullUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaExpectedReturnFullUpdate>
) {
    const withoutData = await db_expected_return_list_for_update(
        app,
        params.body
    );
    if (isError(withoutData)) {
        return withoutData;
    }
    return expectedReturnRecalculateService(app, {
        body: {
            mmYYYY: params.body.mmYYYY,
            type: params.body.type,
            tickers: withoutData.data.map((el) => ({ ticker: el.ticker })),
            user: params.body.user
        },
        res: params.res
    });
}

async function _get_priceOnEndDay(
    app: IApp,
    pointDate: Date,
    tickers: TickerRow[]
): Promise<Result<Map<string, number>>> {
    const result = new Map<string, number>();
    const dateFrom = new Date(pointDate);
    dateFrom.setDate(1);
    const items = await db_tickers_prices_month_list(app, {
        tickers,
        type: "7685225c-af44-4c1a-9829-81273a2580c2",
        date_from: dateFrom,
        date_to: pointDate,
        valid_date: pointDate
    });
    if (isError(items)) {
        return items as any;
    }

    for (let item of items.data) {
        result.set(item.ticker, item.value);
    }

    return okJson(result);
}

// Расчет рыночных expected return показателей
async function _calculate_expected_return_market(
    app: IApp,
    mmYYYY: string,
    tickers: TickerRow[],
    cur_user: string
) {
    const dataItems = await tickersMonthDataListService(app, {
        query: { mmYYYY: mmYYYY }
    });
    if (isError(dataItems)) {
        return dataItems as any;
    }
    // prettier-ignore
    const pointDate = addDays(addMonths(parse(mmYYYY, "MMyyyy", new Date()), 1), -1);

    // prettier-ignore
    const closePrices = await _get_priceOnEndDay(app, pointDate, tickers);
    if (isError(closePrices)) {
        return closePrices as any;
    }
    const procData = await indicesForErService(app, {
        query: { date: pointDate }
    });
    if (isError(procData)) {
        return procData as any;
    }

    tickers = await _checkTickersBeforeCalcEr(
        app,
        tickers,
        dataItems.data,
        closePrices.data
    );
    const items: { ticker: string; er: number }[] = [];
    for (const ticker of tickers) {
        const tickerData = dataItems.data[ticker.ticker];

        const p = procData.data[ticker.stock_index];
        if (!p) {
            db_notifications_new(app, {
                kind: "ExpectedReturn::get proc",
                description:
                    "Нет индексных значений в базе для тикера " + ticker.ticker,
                meta: {},
                users: [KURILENKO_ID, SERGEEV_ID]
            });
            continue;
        }
        const proc1 = p.price_return;
        const proc2 = p.div_forecast;
        const beta = tickerData.beta_raw;
        const div =
            tickerData.best_edps_cur_yr / closePrices.data.get(ticker.ticker)!;
        const er = Math.pow(proc1 * beta + proc2 - div + 1, 1.0 / 12.0) - 1;
        if (Number.isNaN(er)) {
            db_notifications_new(app, {
                kind: "ExpectedReturn::some shares with NaN",
                description: "er is NaN для тикера " + ticker.ticker,
                meta: {},
                users: [KURILENKO_ID, SERGEEV_ID]
            });
        } else {
            items.push({ ticker: ticker.ticker, er });
        }
    }
    if (items.length === 0) {
        return okJson(null);
    }
    return db_expected_return_update(app, {
        mmYYYY,
        type: "86CoAsZkJ3FWgYeNcn8cf",
        data: items,
        user: cur_user
    });
}

// Возвращаем только те записи по которым не нашли ошибки
async function _checkTickersBeforeCalcEr(
    app: IApp,
    tickers: TickerRow[],
    dataItem: { [p: string]: TickersMonthDataRow },
    closePrices: Map<string, number>
) {
    const errList = new Map();
    const resultList: TickerRow[] = [];
    for (const ticker of tickers) {
        const err: any[] = [];
        if (!dataItem[ticker.ticker]) {
            err.push(
                "не найдены данные для расчета expected return для тикера " +
                    ticker.ticker
            );
        }
        if (!closePrices.has(ticker.ticker)) {
            err.push("нет цен на конец месяца для расчета er");
        }
        if (err.length > 0) {
            errList.set(ticker.ticker, err.join(";"));
        } else {
            resultList.push(ticker);
        }
    }
    if (errList.size > 0) {
        db_notifications_new(app, {
            kind: "ExpectedReturn::Calculation",
            description: "Обновление expected return записей",
            meta: Object.fromEntries(errList),
            users: [KURILENKO_ID, SERGEEV_ID]
        });
    }
    return resultList;
}

export async function expectedReturnRecalculateService(
    app: IApp,
    params: z.infer<typeof SchemaExpectedReturnRecalculate>
) {
    if (params.body.type === "86CoAsZkJ3FWgYeNcn8cf") {
        const tickers = await tickersListServiceByTickersList(app, {
            tickers: params.body.tickers.map((el) => el.ticker)
        });
        if (isError(tickers)) {
            return tickers;
        }
        params.res
            .status(202)
            .send("Операция может выполняться довольно продолжительное время.");
        const getData = await tickersMonthDataFullUpdateService(app, {
            body: {
                mmYYYY: params.body.mmYYYY,
                user: params.body.user
            }
        });
        let errMsg: string | null = null;
        if (isError(getData)) {
            errMsg = String(getData.data);
        }
        if (errMsg === null) {
            const res = await _calculate_expected_return_market(
                app,
                params.body.mmYYYY,
                tickers.data,
                params.body.user
            );
            if (isError(res)) {
                errMsg = String(res.data);
            }
        }
        if (errMsg !== null) {
            db_notifications_new(app, {
                kind: "ExpectedReturn::_calculate_expected_return_market",
                description: errMsg,
                meta: {},
                users: [KURILENKO_ID, SERGEEV_ID]
            });
            return err400("string", errMsg);
        }
        return okJson(null);
    } else if (params.body.type === "6G0UUr8GV4ZlLg_7G71DU") {
        const res = await db_er_risk_rate_auto_update(app, {
            mmYYYY: params.body.mmYYYY,
            data: params.body.tickers,
            user: params.body.user
        });
        if (isError(res)) {
            db_notifications_new(app, {
                kind: "ExpectedReturn::_er_risk_rate_auto_update",
                //@ts-ignore
                description: res.data as string,
                meta: {},
                users: [KURILENKO_ID, SERGEEV_ID]
            });
            return err400("string", res.data);
        }
    }
    return err400(
        "string",
        "неизвестный тип expected return для расчета месячных показателей "
    );
}

export async function expectedReturnUpdateRiskFreeService(
    app: IApp,
    params: z.infer<typeof SchemaExpectedReturnUpdateRiskFree>
): Promise<Result<any>> {
    const { isForce, mmYYYY, type, items, user } = params.body;
    if (!isForce) {
        const is_val = await db_expected_return_list_is_data_has(
            app,
            params.body
        );
        if (is_val.data) {
            return errConflict(
                "В базе обнаружены записи на данную дату. Вы уверены что хотите их переписать?"
            );
        }
    }
    return _update_er_for_risk_free(app, mmYYYY, type, items, user);
}

export async function expectedReturnUpdateRiskFreeByTickersService(
    app: IApp,
    params: z.infer<typeof SchemaExpectedReturnUpdateRiskFreeByTickers>
): Promise<Result<any>> {
    const { mmYYYY, tickers, user } = params.body;
    return db_expected_return_update(app, {
        mmYYYY,
        type: "6G0UUr8GV4ZlLg_7G71DU",
        data: tickers.map((el) => ({ ticker: el.ticker, er: el.value })),
        user
    });
}

async function _update_er_for_risk_free(
    app: IApp,
    mmYYYY: string,
    type: string,
    items: { value: number; index: string }[],
    user: string
) {
    const ticker_list = await tickersListService(app, {
        query: { isActive: true }
    });

    if (isError(ticker_list)) {
        return ticker_list as any;
    }

    const updateER: z.infer<typeof SchemaExpectedReturnUpdateItem> = {
        mmYYYY,
        type,
        data: [],
        user
    };
    const indicesMap = new Map<string, number>(
        items.map((el) => [el.index, el.value])
    );

    updateER.data = ticker_list.data
        .filter((el) => indicesMap.has(el.stock_index))
        .map((el) => ({
            ticker: el.ticker,
            er: indicesMap.get(el.stock_index)!
        }));

    return await db_expected_return_update(app, updateER);
}
