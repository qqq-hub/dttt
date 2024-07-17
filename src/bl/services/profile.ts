import { z } from "zod";
import { db_users_get_by_email, db_users_update } from "../models/users";
import crypto from "crypto";
import { err400, isError, okJson } from "../result";
import {
    SchemaProfilePasswordChange,
    SchemaProfileUpdate
} from "../schema/profile";
import { nanoid } from "nanoid";

export async function profilePasswordChangeService(
    app: IApp,
    params: z.infer<typeof SchemaProfilePasswordChange>
) {
    const { email, cur_pass, new_pass, user } = params.body;
    const res_user = await db_users_get_by_email(app, { email });

    const hash = crypto
        .createHmac("sha256", cur_pass + ":" + res_user.data.salt)
        .digest("hex");
    if (hash !== res_user.data.hash) {
        return err400("string", "Не верный пароль!");
    }

    const salt = nanoid();
    const new_hash = crypto
        .createHmac("sha256", new_pass + ":" + salt)
        .digest("hex");

    return db_users_update(app, {
        ...res_user.data,
        hash: new_hash,
        salt,
        user
    });
}

export async function profileUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaProfileUpdate>
) {
    const { email, first_name, last_name, middle_name, group_id } = params.body;
    const res_user = await db_users_get_by_email(app, { email });
    const user = res_user.data;
    const res = await db_users_update(app, {
        ...user,
        user: params.body.user,
        email,
        first_name,
        last_name,
        middle_name,
        group_id
    });
    if (isError(res)) {
        return res;
    }
    return okJson({
        id: user.id,
        email,
        firstName: first_name,
        lastName: last_name,
        middleName: middle_name,
        group: group_id,
        oldGroup: user.group_id
    });
}
