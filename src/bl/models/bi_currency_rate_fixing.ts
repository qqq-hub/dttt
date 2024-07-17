import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaBiCurrencyRateFixingRangeItem,
    SchemaBiCurrencyRateFixingUploadItem
} from "../schema/bi_currency_rate_fixing";

export const db_bi_currency_rate_fixing_load = WrapDataBaseMethod(
    "select common.bi_currency_rate_fixing_load($biCurrency,$dFrom,$dTo);",
    SchemaBiCurrencyRateFixingRangeItem,
    r<any[]>()
);

export const db_bi_currency_rate_fixing_upload = WrapDataBaseMethod(
    "call common.bi_currency_rate_fixing_upload($biCurrency,$data::jsonb);",
    SchemaBiCurrencyRateFixingUploadItem,
    r<any[]>()
);
