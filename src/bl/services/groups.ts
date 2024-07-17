import { z } from "zod";
import {
    db_groups_list,
    db_groups_new,
    db_groups_update
} from "../models/groups";
import {
    SchemaGroupsList,
    SchemaGroupsNew,
    SchemaGroupsUpdate
} from "../schema/groups";

export function groupsListService(
    app: IApp,
    params: z.infer<typeof SchemaGroupsList>
) {
    return db_groups_list(app, params.query);
}

export function groupsNewService(
    app: IApp,
    params: z.infer<typeof SchemaGroupsNew>
) {
    return db_groups_new(app, params.body);
}

export function groupsUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaGroupsUpdate>
) {
    return db_groups_update(app, params.body);
}
