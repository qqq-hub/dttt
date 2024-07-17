import { z } from "zod";
import { err400, isError } from "../result";
import {
    SchemaNotificationsGet,
    SchemaNotificationsList,
    SchemaNotificationsNew,
    SchemaNotificationsReadIt
} from "../schema/notifications";
import {
    db_notifications_get,
    db_notifications_list,
    db_notifications_new,
    db_notifications_read_it
} from "../models/notifications";

export async function notificationsNewService(
    app: IApp,
    params: z.infer<typeof SchemaNotificationsNew>
) {
    const res = await db_notifications_new(app, params.body);
    if (isError(res)) {
        return res;
    }
    return res;
}

export async function notificationsListService(
    app: IApp,
    params: z.infer<typeof SchemaNotificationsList>
) {
    const res = await db_notifications_list(app, params.body);
    if (isError(res)) {
        return res;
    }
    return res;
}

export async function notificationsGetService(
    app: IApp,
    params: z.infer<typeof SchemaNotificationsGet>
) {
    const res = await db_notifications_get(app, params.query);
    if (isError(res)) {
        return res;
    }
    return res;
}

export async function notificationsReadItService(
    app: IApp,
    params: z.infer<typeof SchemaNotificationsReadIt>
) {
    const res = await db_notifications_read_it(app, params.body);
    if (isError(res)) {
        return res;
    }
    return res;
}
