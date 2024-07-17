import { z } from "zod";
import {
    SchemaTickerDividendsListByTicker,
    SchemaTickerDividendsUpdate,
    SchemaTickerDividendsRemove,
    SchemaTickerDividendsList
} from "../schema/ticker_dividends";
import {
    TickerDividendsListRow,
    db_ticker_dividends_list,
    db_ticker_dividends_list_by_ticker,
    db_ticker_dividends_remove,
    db_ticker_dividends_update
} from "../models/ticker_dividents";
import { isError, okJson } from "../result";

export function tickerDividendsListByTickerService(
    app: IApp,
    params: z.infer<typeof SchemaTickerDividendsListByTicker>
) {
    return db_ticker_dividends_list_by_ticker(app, params.query);
}

export async function tickerDividendsListService(
    app: IApp,
    params: z.infer<typeof SchemaTickerDividendsList>
) {
    const res = await db_ticker_dividends_list(app, params.body);
    if (isError(res)) {
        return res as any;
    }
    const result: { [key: string]: TickerDividendsListRow[] } = {};
    for (const { ticker } of params.body.tickers) {
        result[ticker] = res.data
            .filter((el) => el.ticker === ticker)
            .map((el) => ({ ...el, date: new Date(el.date) }));
    }
    return okJson(result);
}

export function tickerDividendsUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaTickerDividendsUpdate>
) {
    return db_ticker_dividends_update(app, params.body);
}

export function tickerDividendsRemoveService(
    app: IApp,
    params: z.infer<typeof SchemaTickerDividendsRemove>
) {
    return db_ticker_dividends_remove(app, params.body);
}
