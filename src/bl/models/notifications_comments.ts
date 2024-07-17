import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaNotificationsCommentListItem,
    SchemaNotificationsCommentRemoveItem,
    SchemaNotificationsCommentSendItem
} from "../schema/notifications_comments";

export const db_notifications_comments_send = WrapDataBaseMethod(
    "select data.notifications_comments_send($notification_uid, $comment, $user);",
    SchemaNotificationsCommentSendItem,
    r<void>()
);

export const db_notifications_comments_list = WrapDataBaseMethod(
    "select data.notifications_comments_list($notification_uid);",
    SchemaNotificationsCommentListItem,
    r<void>()
);

export const db_notifications_comments_remove = WrapDataBaseMethod(
    "select data.notifications_comments_remove($comment_uid, $user);",
    SchemaNotificationsCommentRemoveItem,
    r<void>()
);
