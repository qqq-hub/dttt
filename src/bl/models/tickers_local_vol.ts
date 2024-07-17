import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaTickersLocalVolCalcGetByTickersItem,
    SchemaTickersLocalVolCalcListItem,
    SchemaTickersLocalVolCalcSaveItem,
    SchemaTickersLocalVolDataGetItem,
    SchemaTickersLocalVolDataListItem,
    SchemaTickersLocalVolDataSaveItem,
    SchemaTickersLocalVolDataSaveQueryItem
} from "../schema/tickers_local_vol";

export const db_tickers_local_vol_data_get = WrapDataBaseMethod(
    "select data.tickers_local_vol_data_get($uid);",
    SchemaTickersLocalVolDataGetItem,
    r<{
        date: string;
        dates: { date: string }[];
        strikes: { strike: number }[];
        items: number[][];
    }>()
);

export const db_tickers_local_vol_data_save = WrapDataBaseMethod(
    "select data.tickers_local_vol_data_save($user, $date,$ticker,$data, $isForce);",
    SchemaTickersLocalVolDataSaveItem.merge(
        SchemaTickersLocalVolDataSaveQueryItem
    ),
    r<string>()
);

export const db_tickers_local_vol_data_list = WrapDataBaseMethod(
    "select data.tickers_local_vol_data_list($ticker);",
    SchemaTickersLocalVolDataListItem,
    r<
        {
            uid: string;
            date: string;
            event_dt: string;
            creator: string;
        }[]
    >()
);

export const db_tickers_local_vol_calc_get = WrapDataBaseMethod(
    "select data.tickers_local_vol_calc_get($uid);",
    SchemaTickersLocalVolCalcListItem,
    r<any[]>()
);

export const db_tickers_local_vol_calc_get_by_tickers = WrapDataBaseMethod(
    "select data.tickers_local_vol_calc_get_by_tickers($tickers::jsonb, $dateFrom, $dateTo);",
    SchemaTickersLocalVolCalcGetByTickersItem,
    r<any[]>()
);

export const db_tickers_local_vol_calc_get_pre_calc_data = WrapDataBaseMethod(
    "select data.tickers_local_vol_calc_get_pre_calc_data($uid);",
    SchemaTickersLocalVolCalcListItem,
    r<any[]>()
);

export const db_tickers_local_vol_calc_save = WrapDataBaseMethod(
    "select data.tickers_local_vol_calc_save($creator, $uid, $data::jsonb);",
    SchemaTickersLocalVolCalcSaveItem,
    r<void>()
);
