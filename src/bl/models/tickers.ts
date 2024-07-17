import { z } from "zod";
import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaTickerNewDbItem,
    SchemaTickerUpdateItem
} from "../schema/tickers";

export const db_ticker_new = WrapDataBaseMethod(
    "call data.ticker_new($ticker, $stock_index, $native_ticker, $currency, $user);",
    SchemaTickerNewDbItem,
    r<void>()
);
export const db_ticker_update = WrapDataBaseMethod(
    "call data.ticker_update($ticker, $stock_index, $native_ticker, $currency,  $user, $is_remove);",
    SchemaTickerUpdateItem,
    r<void>()
);

export type TickerRow = {
    ticker: string;
    stock_index: string;
    native_ticker: string | null;
    currency: string;
};

export type SliceRow = {
    validate_from: string;
    validate_to: string;
    event_date: string;
    comment: string;
    user: string;
};

export const db_tickers_list = WrapDataBaseMethod(
    "select data.tickers_list($isActive);",
    z.object({ isActive: z.boolean() }),
    r<TickerRow[]>()
);
