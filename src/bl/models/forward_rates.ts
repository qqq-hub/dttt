import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaForwardRatesListItem,
    SchemaForwardRatesUpdateItem
} from "../schema/forward_rates";

export const db_forward_rates_list = WrapDataBaseMethod(
    "select data.forward_rates_list($date);",
    SchemaForwardRatesListItem,
    r<
        {
            currency1: string;
            currency2: string;
            value: number;
            start_date: Date;
        }[]
    >()
);

export const db_forward_rates_update = WrapDataBaseMethod(
    "select data.forward_rates_update($start_date, $items::jsonb, $user);",
    SchemaForwardRatesUpdateItem,
    r<void>()
);
