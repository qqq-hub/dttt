import { z } from "zod";
import { err400, isError } from "../result";
import {
    SchemaNotificationsCommentList,
    SchemaNotificationsCommentRemove,
    SchemaNotificationsCommentSend
} from "../schema/notifications_comments";
import {
    db_notifications_comments_list,
    db_notifications_comments_remove,
    db_notifications_comments_send
} from "../models/notifications_comments";

export async function notificationsCommentsSendService(
    app: IApp,
    params: z.infer<typeof SchemaNotificationsCommentSend>
) {
    const res = await db_notifications_comments_send(app, params.body);
    if (isError(res)) {
        return res;
    }
    return res;
}

export async function notificationsCommentListService(
    app: IApp,
    params: z.infer<typeof SchemaNotificationsCommentList>
) {
    const res = await db_notifications_comments_list(app, params.query);
    if (isError(res)) {
        return res;
    }
    return res;
}

export async function notificationsCommentRemoveService(
    app: IApp,
    params: z.infer<typeof SchemaNotificationsCommentRemove>
) {
    const res = await db_notifications_comments_remove(app, params.body);
    if (isError(res)) {
        return res;
    }
    return res;
}
