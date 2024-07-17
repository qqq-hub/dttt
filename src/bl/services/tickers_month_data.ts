import { z } from "zod";
import { isError, okJson } from "../result";
import { TickerRow } from "../models/tickers";
import { TickerHistoryRow } from "../models/tickers_history";
import { addDays, addYears, parse, addMonths } from "date-fns";
import {
    db_tickers_month_data_list,
    db_tickers_month_data_list_for_update,
    db_tickers_month_data_update,
    TickersMonthDataRow
} from "../models/tickers_month_data";
import {
    SchemaTickersMonthDataFullUpdate,
    SchemaTickersMonthDataList,
    SchemaTickersMonthDataRecalculateBeta,
    SchemaTickersMonthDataUpdateItemDataItem
} from "../schema/tickers_month_data";
import { tickersPricesMonthListService } from "./tickers_prices";
import { slop } from "../../utils/math";
import { db_notifications_new } from "../models/notifications";
import { KURILENKO_ID, SERGEEV_ID } from "../../utils/users";

export async function tickersMonthDataFullUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaTickersMonthDataFullUpdate>
): Promise<Result<void>> {
    // prettier-ignore
    const withoutData = await db_tickers_month_data_list_for_update(app, params.body);
    if (isError(withoutData)) {
        return withoutData as any;
    }
    // prettier-ignore
    const pointDate = addDays(addMonths(parse(params.body.mmYYYY, "MMyyyy", new Date()), 1), -1)
    const beta = await _calculateBeta(app, pointDate, withoutData.data);
    if (isError(beta)) {
        return beta as any;
    }
    const tickerList = Array.from(beta.data.keys());
    // prettier-ignore
    const div = await _calculate_div(app, pointDate.getFullYear(), tickerList);
    if (isError(div)) {
        return div as any;
    }
    type row = z.infer<typeof SchemaTickersMonthDataUpdateItemDataItem>;
    const items: row[] = [];
    await _check_err_update(app, withoutData.data, div.data, beta.data);
    for (const ticker of tickerList) {
        items.push({
            ticker: ticker,
            best_edps_cur_yr: div.data.get(ticker) || 0,
            beta_raw: beta.data.get(ticker) || 0
        });
    }
    return db_tickers_month_data_update(app, {
        mmYYYY: params.body.mmYYYY,
        data: items,
        user: params.body.user
    });
}

async function _check_err_update(
    app: IApp,
    tickers: TickerRow[],
    div: Map<string, number>,
    beta: Map<string, number>
) {
    const errList = new Map();
    for (const { ticker } of tickers) {
        const err: any[] = [];
        if (!div.has(ticker)) {
            err.push(`div calc problem`);
        }
        if (!beta.has(ticker)) {
            err.push(`beta calc problem`);
        }
        if (err.length > 0) {
            errList.set(ticker, err.join(";"));
        }
    }
    if (errList.size > 0) {
        await db_notifications_new(app, {
            kind: "MonthData::FullUpdate",
            description: "Месячное обновление данных",
            meta: Object.fromEntries(errList),
            users: [KURILENKO_ID, SERGEEV_ID]
        });
    }
}

async function _calculate_div(app: IApp, year: number, tickers: string[]) {
    return app.finance.getDiv(app, tickers, year);
}

async function _calculateBeta(
    app: IApp,
    pointDate: Date,
    tickers: TickerRow[]
): Promise<Result<Map<string, number>>> {
    const params: any = {
        body: {
            valid_date: pointDate,
            date_from: addYears(pointDate, -3),
            date_to: new Date(pointDate),
            type: "7685225c-af44-4c1a-9829-81273a2580c2",
            tickers
        }
    };

    const tickersPrices = await tickersPricesMonthListService(app, params);
    if (isError(tickersPrices)) {
        return tickersPrices as any;
    }
    params.body.tickers = tickers.map((el) => ({ ticker: el.stock_index }));
    const indicesPrices = await tickersPricesMonthListService(app, params);
    if (isError(indicesPrices)) {
        return indicesPrices as any;
    }

    const result = new Map<string, number>();
    const errList = new Map<string, string>();
    for (let ticker of tickers) {
        const tickersValue = calculateRelativeChanges(
            tickersPrices.data[ticker.ticker]
        );
        if (12 > tickersValue.length) {
            errList.set(ticker.ticker, "not enough rows for beta data");
            continue;
        }
        const indicesValue = calculateRelativeChanges(
            indicesPrices.data[ticker.stock_index]
        );
        result.set(
            ticker.ticker,
            slop(tickersValue, indicesValue.slice(-tickersValue.length))
        );
    }
    if (errList.size > 0) {
        db_notifications_new(app, {
            kind: "TickersMonthData::calBeta",
            description: "Проблема расчета беты",
            meta: Object.fromEntries(errList),
            users: [KURILENKO_ID, SERGEEV_ID]
        });
    }
    return okJson(result);
}

// Определяем отношение изменение цены
function calculateRelativeChanges(val: TickerHistoryRow[]): number[] {
    const res: any = [];
    const v = val.sort((a, b) => a.date.getTime() - b.date.getTime());
    for (let i = 1; i < v.length; i++) {
        res.push(v[i].value / v[i - 1].value - 1);
    }
    return res;
}

export function tickersMonthDataRecalculateBeta(
    app: IApp,
    params: z.infer<typeof SchemaTickersMonthDataRecalculateBeta>
) {}

export async function tickersMonthDataListService(
    app: IApp,
    params: z.infer<typeof SchemaTickersMonthDataList>
): Promise<Result<{ [key: string]: TickersMonthDataRow }>> {
    const res = await db_tickers_month_data_list(app, params.query);
    if (isError(res)) {
        return res as any;
    }
    const result: { [key: string]: TickersMonthDataRow } = {};
    for (let item of res.data) {
        result[item.ticker] = item;
    }
    return okJson(result);
}

export const for_unit_test = {
    _calculateBeta
};
