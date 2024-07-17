import { z } from "zod";
import { SchemaAuthLogin } from "../schema/auth";
import { db_users_get_by_email } from "../models/users";
import { db_log_login_new } from "../models/log_login";
import crypto from "crypto";
import { err400, okJson } from "../result";

export async function authLoginService(
    app: IApp,
    params: z.infer<typeof SchemaAuthLogin>
) {
    const { email, pass, client_ip } = params.body;
    const res_user = await db_users_get_by_email(app, { email });
    const user = res_user.data;
    const errLoginMsg = "Не верный логин или пароль!";
    if (!user) {
        return err400("string", errLoginMsg);
    }
    const hash = crypto
        .createHmac("sha256", pass + ":" + user.salt)
        .digest("hex");
    if (hash !== user.hash) {
        return err400("string", errLoginMsg);
    }
    await db_log_login_new(app, { user_id: user.id, client_ip });
    return okJson({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        group: user.group_id
    });
}
