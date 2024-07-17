import { object, z } from "zod";

export const SchemaNotificationsCommentSendItem = object({
    notification_uid: z.string({
        required_error: "notification_uid is required"
    }),
    comment: z.string(),
    user: z.string({ required_error: "user is required" })
});

export const SchemaNotificationsCommentSend = object({
    body: SchemaNotificationsCommentSendItem
});

export const SchemaNotificationsCommentListItem = object({
    notification_uid: z.string({
        required_error: "notification_uid is required"
    })
});

export const SchemaNotificationsCommentList = object({
    query: SchemaNotificationsCommentListItem
});

export const SchemaNotificationsCommentRemoveItem = object({
    comment_uid: z.string({
        required_error: "comment_uid is required"
    }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaNotificationsCommentRemove = object({
    body: SchemaNotificationsCommentRemoveItem
});
