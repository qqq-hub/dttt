import { z } from "zod";
import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaMarketsNewItem,
    SchemaMarketsUpdateItem
} from "../schema/markets";

export const db_markets_new = WrapDataBaseMethod(
    "call data.markets_new($market, $user);",
    SchemaMarketsNewItem,
    r<void>()
);
export const db_markets_update = WrapDataBaseMethod(
    "call data.markets_update($market, $is_remove, $user);",
    SchemaMarketsUpdateItem,
    r<void>()
);

export const db_markets_list = WrapDataBaseMethod(
    "select data.markets_list($isActive);",
    z.object({ isActive: z.boolean() }),
    r<
        {
            market: string;
            currency: string;
        }[]
    >()
);
