import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaTickerDividendsListByTickerItem,
    SchemaTickerDividendsUpdateItem,
    SchemaTickerDividendsRemoveItem,
    SchemaTickerDividendsListItem
} from "../schema/ticker_dividends";

export type TickerDividendsListRow = {
    ticker: string;
    value: number;
    date: Date;
};

export const db_ticker_dividends_list_by_ticker = WrapDataBaseMethod(
    "select data.ticker_dividends_list_by_ticker($ticker);",
    SchemaTickerDividendsListByTickerItem,
    r<
        {
            ticker: string;
            value: number;
            date: string;
        }[]
    >()
);

export const db_ticker_dividends_list = WrapDataBaseMethod(
    "select data.ticker_dividends_list($dateFrom, $dateTo, $validDate, $tickers::jsonb);",
    SchemaTickerDividendsListItem,
    r<TickerDividendsListRow[]>()
);

export const db_ticker_dividends_update = WrapDataBaseMethod(
    "select data.ticker_dividends_update($data::jsonb,$user);",
    SchemaTickerDividendsUpdateItem,
    r<void>()
);

export const db_ticker_dividends_remove = WrapDataBaseMethod(
    "select data.ticker_dividends_remove($data::jsonb,$user);",
    SchemaTickerDividendsRemoveItem,
    r<void>()
);
