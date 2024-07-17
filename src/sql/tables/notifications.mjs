/**
 *
 * @returns {SqlTable}
 */
export function createNotificationsTable() {
    return {
        query: `
CREATE TABLE data.notifications (
                                      notification_uid uuid NOT NULL,
                                      kind text NOT NULL,
                                      description text NULL,
                                      meta jsonb NULL,
                                      event_dt timestamptz NOT NULL,
                                      CONSTRAINT notifications_pkey PRIMARY KEY (notification_uid)
);
`
    };
}
