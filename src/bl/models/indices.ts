import { z } from "zod";
import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaIndicesForErrItem,
    SchemaIndicesNewItem,
    SchemaIndicesUpdateItem
} from "../schema/indices";

export const db_indices_new = WrapDataBaseMethod(
    "select data.indices_new($index, $description, $market, $user);",
    SchemaIndicesNewItem,
    r<void>()
);
export const db_indices_update = WrapDataBaseMethod(
    "select data.indices_update($index, $description, $market, $is_remove, $user);",
    SchemaIndicesUpdateItem,
    r<void>()
);

export const db_indices_list = WrapDataBaseMethod(
    "select data.indices_list($isActive);",
    z.object({ isActive: z.boolean() }),
    r<{
        short: string;
        name: string;
    }>()
);

export type IndicesForErResultItem = {
    index: string;
    price_return: number;
    div_forecast: number;
};
export const db_indices_for_er = WrapDataBaseMethod(
    "select data.indices_for_er($date::date);",
    SchemaIndicesForErrItem,
    r<IndicesForErResultItem[]>()
);
