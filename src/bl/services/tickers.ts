import {
    db_ticker_new,
    db_tickers_list,
    db_ticker_update
} from "../models/tickers";
import { z } from "zod";
import {
    SchemaTickersList,
    SchemaTickerNew,
    SchemaTickerUpdate
} from "../schema/tickers";
import { err400, isError, okJson } from "../result";
import { tickersPricesFetchRangeService } from "./tickers_prices";
import { expectedReturnRecalculateService } from "./expected_return";
import { getEmptyRes } from "../../utils/express";
import { format, subMonths } from "date-fns";

export async function tickerNewService(
    app: IApp,
    params: z.infer<typeof SchemaTickerNew>
) {
    const res = await db_ticker_new(app, params.body);
    if (isError(res)) {
        try {
            // @ts-ignore
            const msg: string = res.data;
            if (msg.indexOf("already exists") > -1) {
                return err400(
                    "string",
                    "Тикер с таким именем уже был заведен ранее"
                );
            }
        } catch (e) {}
    }
    // Так как ответа можно ждать достаточно долго, не дожидаемся результата сохранения полученной истории
    _fetchAdditionalInfoByTicker(app, params);
    return res;
}

// Получение дополнительных цен, er и прочих вещей по вновь добавленной акции
async function _fetchAdditionalInfoByTicker(
    app: IApp,
    params: z.infer<typeof SchemaTickerNew>
) {
    // Важно сохранять полученные цены иначе не сможем пересчитать рыночный er
    await tickersPricesFetchRangeService(app, {
        body: {
            tickers: [{ ticker: params.body.ticker }],
            date_from: params.body.start_date,
            date_to: new Date(),
            type: "7685225c-af44-4c1a-9829-81273a2580c2",
            user: params.body.user
        }
    });
    const mmYYYY = format(subMonths(new Date(), 1), "MMyyyy");
    const typesList = ["86CoAsZkJ3FWgYeNcn8cf", "6G0UUr8GV4ZlLg_7G71DU"];
    for (const t of typesList) {
        expectedReturnRecalculateService(app, {
            body: {
                tickers: [{ ticker: params.body.ticker }],
                mmYYYY,
                user: params.body.user,
                type: t
            },
            res: getEmptyRes()
        });
    }
}
export function tickerUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaTickerUpdate>
) {
    return db_ticker_update(app, params.body);
}

export function tickersListService(
    app: IApp,
    params: z.infer<typeof SchemaTickersList>
) {
    return db_tickers_list(app, params.query);
}

export async function tickersListServiceByTickersList(
    app: IApp,
    params: { tickers: string[] }
) {
    const items = await db_tickers_list(app, { isActive: true });
    if (isError(items)) {
        return items;
    }
    const tickers = new Set(params.tickers);
    return okJson(items.data.filter((el) => tickers.has(el.ticker)));
}
