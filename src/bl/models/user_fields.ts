import { r, WrapDataBaseMethod } from "../db";
import { z } from "zod";
import {
    SchemaUserFieldsItemAdd,
    SchemaUserFieldsItemUpdate
} from "../schema/user_fields";

export const db_user_fields_load = WrapDataBaseMethod(
    "select common.user_fields_load($status, $group);",
    z.object({ status: z.string(), group: z.number() }),
    r<
        {
            id: string;
            name: string;
            description: string;
            meta: {
                filter: string;
                forSection: number[];
                settings: unknown;
                type: string;
            };
            status: string;
        }[]
    >()
);

export const db_user_fields_add = WrapDataBaseMethod(
    "call common.user_fields_add($data, $user, $group);",
    SchemaUserFieldsItemAdd,
    r<void>()
);

export const db_user_fields_update = WrapDataBaseMethod(
    "call common.user_fields_update($data, $user, $group);",
    SchemaUserFieldsItemUpdate,
    r<void>()
);
