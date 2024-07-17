import { z } from "zod";
import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaCurrenciesNewItem,
    SchemaCurrenciesUpdateItem
} from "../schema/currencies";

export const db_currencies_new = WrapDataBaseMethod(
    "select data.currencies_new($short, $name, user);",
    SchemaCurrenciesNewItem,
    r<void>()
);
export const db_currencies_update = WrapDataBaseMethod(
    "select data.currencies_update($short, $name, $is_remove);",
    SchemaCurrenciesUpdateItem,
    r<void>()
);

export const db_currencies_list = WrapDataBaseMethod(
    "select data.currencies_list($isActive);",
    z.object({ isActive: z.boolean() }),
    r<{
        short: string;
        name: string;
    }>()
);
