import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaRiskFreeRatesListItem,
    SchemaRiskFreeRatesUpdateItem
} from "../schema/risk_free_rates";

export const db_risk_free_rates_list = WrapDataBaseMethod(
    "select data.risk_free_rates_list($currency, $date);",
    SchemaRiskFreeRatesListItem,
    r<{ currency: string; term: number; rate: number; start_date: Date }[]>()
);

export const db_risk_free_rates_update = WrapDataBaseMethod(
    "select data.risk_free_rates_update($currency, $start_date, $items::jsonb, $user);",
    SchemaRiskFreeRatesUpdateItem,
    r<void>()
);
