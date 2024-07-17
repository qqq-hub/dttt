/**
 *
 * @returns {SqlTable}
 */
export function createUsersNotificationsCommentsTable() {
    return {
        query: `
CREATE TABLE data.notifications_comments (
                                       uid uuid not null,
                                       notification_uid uuid NOT null REFERENCES data.notifications(notification_uid),
                                       "comment" text NULL,
                                       event_dt timestamptz NOT NULL,
                                       "user" text NOT NULL,
                                       is_remove timestamptz null,
                                       CONSTRAINT notifications_comments_pkey PRIMARY KEY (uid)
);`
    };
}
