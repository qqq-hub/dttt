import { r, WrapDataBaseMethod } from "../db";
import { z } from "zod";
import { SchemaGroupsNewItem, SchemaGroupsUpdateItem } from "../schema/groups";

export const db_groups_list = WrapDataBaseMethod(
    "select common.groups_list($isActive);",
    z.object({ isActive: z.boolean() }),
    r<{
        id: string;
        name: string;
        is_remove: boolean;
        description: string;
    }>()
);

export const db_groups_new = WrapDataBaseMethod(
    "select common.groups_new($name, $description, $user);",
    SchemaGroupsNewItem,
    r<void>()
);

export const db_groups_update = WrapDataBaseMethod(
    "select common.groups_update($id, $name, $description, $is_remove, $user);",
    SchemaGroupsUpdateItem,
    r<void>()
);
