import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaExpectedReturnFullUpdateItem,
    SchemaExpectedReturnListByTickerItem,
    SchemaExpectedReturnListItem,
    SchemaExpectedReturnUpdateItem,
    SchemaExpectedReturnListIsDataHasItem,
    SchemaExpectedReturnRiskRateAutoUpdate
} from "../schema/expected_return";
import { TickerRow } from "./tickers";

export const db_expected_return_list_for_update = WrapDataBaseMethod(
    "select data.expected_return_list_for_update($mmYYYY, $type);",
    SchemaExpectedReturnFullUpdateItem,
    r<TickerRow[]>()
);

export const db_expected_return_list = WrapDataBaseMethod(
    "select data.expected_return_list($mmYYYY, $type, $tickers::jsonb);",
    SchemaExpectedReturnListItem,
    r<
        {
            ticker: string;
            er: number;
            type: string;
            mmYYYY: string;
        }[]
    >()
);

export const db_expected_return_list_by_ticker = WrapDataBaseMethod(
    "select data.expected_return_list_by_ticker($ticker, $type);",
    SchemaExpectedReturnListByTickerItem,
    r<
        {
            ticker: string;
            er: number;
            type: string;
            mmYYYY: string;
        }[]
    >()
);

export const db_expected_return_update = WrapDataBaseMethod(
    "select data.expected_return_update($mmYYYY, $type, $data::jsonb,$user);",
    SchemaExpectedReturnUpdateItem,
    r<void>()
);

export const db_er_risk_rate_auto_update = WrapDataBaseMethod(
    "select data.er_risk_rate_auto_update($mmYYYY, $data::jsonb,$user);",
    SchemaExpectedReturnRiskRateAutoUpdate,
    r<void>()
);

export const db_expected_return_list_is_data_has = WrapDataBaseMethod(
    "select data.expected_return_list_is_data_has($mmYYYY, $type, $items::jsonb);",
    SchemaExpectedReturnListIsDataHasItem,
    r<boolean>()
);
