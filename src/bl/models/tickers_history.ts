import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaSlicesByTickerTypeListItem,
    SchemaTickersPricesDayListItem,
    SchemaTickersPricesMakeSliceItem,
    SchemaTickersPricesMonthListItem,
    SchemaTickersPricesUpdateItem,
    SchemaTickersPricesWithoutDayPriceItem
} from "../schema/tickers_prices";
import { SliceRow, TickerRow } from "./tickers";

export type TickerHistoryRow = {
    ticker: string;
    value: number;
    date: Date;
    slice_uid: string;
};

export const db_tickers_prices_month_list = WrapDataBaseMethod(
    "select data.tickers_prices_month_list($type,$valid_date,$date_from,$date_to, $tickers::jsonb);",
    SchemaTickersPricesMonthListItem,
    r<TickerHistoryRow[]>()
);

export const db_tickers_prices_day_list = WrapDataBaseMethod(
    "select data.tickers_prices_day_list($type,$valid_date,$date_from,$date_to, $tickers::jsonb);",
    SchemaTickersPricesDayListItem,
    r<TickerHistoryRow[]>()
);

export const db_tickers_prices_update = WrapDataBaseMethod(
    "select data.tickers_prices_update($type,$data::jsonb, $user);",
    SchemaTickersPricesUpdateItem,
    r<void>()
);

export const db_tickers_prices_without_day_price = WrapDataBaseMethod(
    "select data.tickers_prices_without_day_price($type,$date);",
    SchemaTickersPricesWithoutDayPriceItem,
    r<TickerRow[]>()
);

export const db_slices_by_ticker_type_list = WrapDataBaseMethod(
    "select data.slices_by_ticker_type_list($ticker,$type);",
    SchemaSlicesByTickerTypeListItem,
    r<SliceRow[]>()
);

export const db_tickers_prices_make_slice = WrapDataBaseMethod(
    "select data.tickers_prices_make_slice($ticker,$type, $comment, $date, $user);",
    SchemaTickersPricesMakeSliceItem,
    r<void>()
);
