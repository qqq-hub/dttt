import { z } from "zod";
import {
    SchemaUsersRightsList,
    SchemaUsersRightsNew,
    SchemaUsersRightsRemove
} from "../schema/users_rights";
import {
    db_users_rights_list,
    db_users_rights_new,
    db_users_rights_remove
} from "../models/users_rights";

export function usersRightsListService(
    app: IApp,
    params: z.infer<typeof SchemaUsersRightsList>
) {
    return db_users_rights_list(app, params.query);
}

export function usersRightsNewService(
    app: IApp,
    params: z.infer<typeof SchemaUsersRightsNew>
) {
    return db_users_rights_new(app, params.body);
}

export function usersRightsRemoveService(
    app: IApp,
    params: z.infer<typeof SchemaUsersRightsRemove>
) {
    return db_users_rights_remove(app, params.body);
}
