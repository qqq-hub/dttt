/**
 *
 * @returns {SqlFunction}
 */
export function createNotificationsNewFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.notifications_new(
    p_users jsonb,
    p_kind TEXT,
    p_description TEXT,
    p_meta JSONB
)
    RETURNS VOID
    LANGUAGE plpgsql
AS
$$
DECLARE
    notification_id UUID;
BEGIN
    -- Вставляем новое уведомление в таблицу notifications
    INSERT INTO data.notifications (notification_uid, kind, description, meta, event_dt)
    VALUES (uuid_generate_v4(), p_kind, p_description, p_meta, NOW())
    RETURNING notification_uid INTO notification_id;

    INSERT INTO data.users_notifications (notification_uid, user_id, read_dt)
    SELECT notification_id, usr_id, NULL
    FROM jsonb_array_elements_text(p_users) as usr_id;

END;
$$;


GRANT ALL ON FUNCTION data.notifications_new TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createNotificationsGetFunc() {
    return {
        query: `

CREATE OR REPLACE FUNCTION data.notifications_get(
    p_uid UUID
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
                   'notification_uid', n.notification_uid,
                   'kind', n.kind,
                   'description', n.description,
                   'meta', n.meta,
                   'event_dt', n.event_dt
               )
    INTO result
    FROM data.notifications AS n
    WHERE n.notification_uid = p_uid;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.notifications_get TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createNotificationsListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.notifications_list(
    p_user_id TEXT,
    p_filter JSONB DEFAULT NULL
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS
$$
DECLARE
    result JSONB := '[]'::jsonb;
BEGIN
    WITH filtered_notifications AS (SELECT n.notification_uid, n.kind, n.description, n.meta, n.event_dt, un.read_dt
                                    FROM data.notifications AS n
                                             INNER JOIN data.users_notifications AS un
                                                        ON n.notification_uid = un.notification_uid
                                    WHERE un.user_id = p_user_id
                                      AND ((p_filter ->> 'type' = 'NOT_READ_IT' and un.read_dt IS NULL) or
                                           (p_filter ->> 'type' = 'ALL' AND
                                            n.event_dt BETWEEN (p_filter ->> 'dateFrom')::DATE AND (p_filter ->> 'dateTo')::DATE))),
         comment_counts AS (SELECT nc.notification_uid,
                                   COUNT(*) AS comment_count
                            FROM filtered_notifications AS fn
                                     JOIN data.notifications_comments as nc
                                          ON nc.notification_uid = fn.notification_uid
                            GROUP BY nc.notification_uid)
    SELECT json_agg(jsonb_build_object(
            'notification_uid', fn.notification_uid,
            'kind', fn.kind,
            'description', fn.description,
            'meta', fn.meta,
            'event_dt', fn.event_dt,
            'read_it', fn.read_dt,
            'comment_count', COALESCE(cc.comment_count, 0)
                    ))
    INTO
        result
    FROM filtered_notifications AS fn
             left JOIN comment_counts AS cc ON fn.notification_uid = cc.notification_uid;

    IF result IS NULL THEN
        result = '[]'::jsonb;
    END IF;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.notifications_list TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createNotificationsReadItFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.notifications_read_it(
    p_uids JSONB,
    p_mark_as_read BOOLEAN,
    p_user TEXT
)
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE data.users_notifications
    SET read_dt = CASE WHEN p_mark_as_read THEN NOW() ELSE NULL END
    WHERE user_id = p_user AND notification_uid IN (
        SELECT value::UUID
        FROM jsonb_array_elements_text(p_uids) AS x(value)
    );
END
$$;
GRANT ALL ON FUNCTION data.notifications_read_it TO ytineres_user;
`
    };
}
