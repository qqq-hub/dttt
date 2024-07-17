import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaUsersRightsListItem,
    SchemaUsersRightsItem
} from "../schema/users_rights";

export const db_users_rights_list = WrapDataBaseMethod(
    "select common.users_rights_list_by_id($user_id);",
    SchemaUsersRightsListItem,
    r<string[]>()
);

export const db_users_rights_new = WrapDataBaseMethod(
    "select common.users_rights_new($user_id, $right_id, $user);",
    SchemaUsersRightsItem,
    r<void>()
);

export const db_users_rights_remove = WrapDataBaseMethod(
    "select common.users_rights_remove($user_id, $right_id, $user);",
    SchemaUsersRightsItem,
    r<void>()
);
