import { object, z } from "zod";

export const SchemaNotificationsNewItem = object({
    kind: z.string({ required_error: "kind is required" }),
    description: z.string().optional(),
    meta: z.any().optional(),
    users: z.string().array()
});

export const SchemaNotificationsNew = object({
    body: SchemaNotificationsNewItem
});

export const SchemaNotificationsListItem = object({
    user: z.string({ required_error: "user is required" }),
    filter: z.any().optional()
});

export const SchemaNotificationsList = object({
    body: SchemaNotificationsListItem
});

export const SchemaNotificationsGetItem = object({
    uid: z.string({ required_error: "uid is required" })
});

export const SchemaNotificationsGet = object({
    query: SchemaNotificationsGetItem
});

export const SchemaNotificationsReadItItem = object({
    uids: z.string().array(),
    mark: z.boolean({ required_error: "mark is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaNotificationsReadIt = object({
    body: SchemaNotificationsReadItItem
});
