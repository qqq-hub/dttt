import { r, WrapDataBaseMethod } from "../db";
import { TickerRow } from "./tickers";
import {
    SchemaTickersMonthDataFullUpdateItem,
    SchemaTickersMonthDataList,
    SchemaTickersMonthDataListItem,
    SchemaTickersMonthDataUpdateItem
} from "../schema/tickers_month_data";

export const db_tickers_month_data_list_for_update = WrapDataBaseMethod(
    "select data.tickers_month_data_list_for_update($mmYYYY);",
    SchemaTickersMonthDataFullUpdateItem,
    r<TickerRow[]>()
);

export const db_tickers_month_data_update = WrapDataBaseMethod(
    "select data.tickers_month_data_update($mmYYYY, $data::jsonb, $user);",
    SchemaTickersMonthDataUpdateItem,
    r<void>()
);

export type TickersMonthDataRow = {
    ticker: string;
    mmYYYY: string;
    beta_raw: number;
    best_edps_cur_yr: number;
};

export const db_tickers_month_data_list = WrapDataBaseMethod(
    "select data.tickers_month_data_list($mmYYYY);",
    SchemaTickersMonthDataListItem,
    r<TickersMonthDataRow[]>()
);
