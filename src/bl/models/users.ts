import { r, WrapDataBaseMethod } from "../db";
import { z } from "zod";
import { SchemaUsersNewItemDb, SchemaUsersUpdateItemDb } from "../schema/users";

export const db_users_get_by_email = WrapDataBaseMethod(
    "select common.users_get_by_email($email);",
    z.object({ email: z.string({ required_error: "email is required" }) }),
    r<{
        id: string;
        hash: string;
        salt: string;
        email: string;
        group_id: number;
        last_name: string;
        first_name: string;
        middle_name: string;
        is_remove: boolean;
    }>()
);

export const db_users_list = WrapDataBaseMethod(
    "select common.users_list($isActive, $group_id);",
    z.object({ isActive: z.boolean(), group_id: z.number().optional() }),
    r<{
        id: string;
        email: string;
        group_id: number;
        last_name: string;
        first_name: string;
        middle_name: string;
        group_name: string;
    }>()
);

export const db_users_new = WrapDataBaseMethod(
    "select common.users_new($id, $email, $first_name, $last_name, $middle_name, $group_id, $salt, $hash, $user);",
    SchemaUsersNewItemDb,
    r<void>()
);

export const db_users_update = WrapDataBaseMethod(
    "select common.users_update($id, $email, $first_name, $last_name, $middle_name, $group_id, $salt, $hash, $is_remove, $user);",
    SchemaUsersUpdateItemDb,
    r<void>()
);
