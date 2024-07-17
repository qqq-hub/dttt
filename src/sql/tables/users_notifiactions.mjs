/**
 *
 * @returns {SqlTable}
 */
export function createUsersNotificationTable() {
    return {
        query: `
CREATE TABLE data.users_notifications (
                                            notification_uid uuid NOT null REFERENCES data.notifications(notification_uid),
                                            user_id text NOT NULL,
                                            read_dt timestamptz NULL,
                                            CONSTRAINT users_notifications_pkey PRIMARY KEY (notification_uid, user_id)
);`
    };
}
