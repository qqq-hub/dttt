import { z } from "zod";
import {
    db_users_get_by_email,
    db_users_list,
    db_users_new,
    db_users_update
} from "../models/users";
import {
    SchemaUsersList,
    SchemaUsersNewApi,
    SchemaUsersPasswordSet,
    SchemaUsersUpdateApi
} from "../schema/users";
import { nanoid } from "nanoid";
import crypto from "crypto";
import { err400 } from "../result";

export async function usersNewService(
    app: IApp,
    params: z.infer<typeof SchemaUsersNewApi>
) {
    const { email } = params.body;
    const res_user = await db_users_get_by_email(app, { email });
    const user = res_user.data;
    if (user) {
        return err400("string", "такой email уже зарегистрирован");
    }
    const id = nanoid();
    const salt = nanoid();
    const hash = crypto
        .createHmac("sha256", params.body.password + ":" + salt)
        .digest("hex");

    return db_users_new(app, { ...params.body, id, salt, hash });
}

export async function usersListService(
    app: IApp,
    params: z.infer<typeof SchemaUsersList>
) {
    return db_users_list(app, params.query);
}

export async function usersUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaUsersUpdateApi>
) {
    const { email } = params.body;
    const res_user = await db_users_get_by_email(app, { email });
    const { salt, hash } = res_user.data;
    return db_users_update(app, {
        ...params.body,
        salt,
        hash,
        email,
        id: res_user.data.id
    });
}

export async function usersPasswordSetService(
    app: IApp,
    params: z.infer<typeof SchemaUsersPasswordSet>
) {
    const { email, new_pass, user } = params.body;
    const res_user = await db_users_get_by_email(app, { email });

    const salt = nanoid();
    const hash = crypto
        .createHmac("sha256", new_pass + ":" + salt)
        .digest("hex");

    return db_users_update(app, { ...res_user.data, salt, hash, user });
}
