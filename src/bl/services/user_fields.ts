import { z } from "zod";
import {
    SchemaUserFieldsLoad,
    SchemaUserFieldsAdd,
    SchemaUserFieldsUpdate
} from "../schema/user_fields";
import {
    db_user_fields_load,
    db_user_fields_add,
    db_user_fields_update
} from "../models/user_fields";
import { err400, isError } from "../result";

export function userFieldsLoadService(
    app: IApp,
    params: z.infer<typeof SchemaUserFieldsLoad>
) {
    return db_user_fields_load(app, {
        status: params.query.status,
        group: params.body.group
    });
}

export async function userFieldsAddService(
    app: IApp,
    params: z.infer<typeof SchemaUserFieldsAdd>
) {
    const res = await db_user_fields_add(app, params.body);
    if (isError(res)) {
        try {
            // @ts-ignore
            const msg: string = res.data;
            if (msg.indexOf("already exists") > -1) {
                return err400("string", "Поле с таким именем уже существует");
            }
        } catch (e) {}
    }
    return res;
}

export function userFieldsUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaUserFieldsUpdate>
) {
    return db_user_fields_update(app, params.body);
}
