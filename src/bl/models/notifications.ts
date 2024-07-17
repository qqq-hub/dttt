import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaNotificationsGetItem,
    SchemaNotificationsListItem,
    SchemaNotificationsNewItem,
    SchemaNotificationsReadItItem
} from "../schema/notifications";

export const db_notifications_new = WrapDataBaseMethod(
    "select data.notifications_new($users::jsonb, $kind, $description, $meta::jsonb);",
    SchemaNotificationsNewItem,
    r<void>()
);

export const db_notifications_list = WrapDataBaseMethod(
    "select data.notifications_list($user::text, $filter::jsonb);",
    SchemaNotificationsListItem,
    r<
        {
            notification_uid: string;
            kind: string;
            description: string;
            meta: string;
            event_dt: Date;
            read_it: Date | null;
            comment_count: number;
        }[]
    >()
);

export const db_notifications_get = WrapDataBaseMethod(
    "select data.notifications_get($uid);",
    SchemaNotificationsGetItem,
    r<void>()
);

export const db_notifications_read_it = WrapDataBaseMethod(
    "select data.notifications_read_it($uids::jsonb, $mark, $user);",
    SchemaNotificationsReadItItem,
    r<void>()
);
