/**
 *
 * @returns {SqlFunction}
 */
export function createNotificationsCommentsSendFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.notifications_comments_send(
    p_notification_uid UUID,
    p_comment TEXT,
    p_user TEXT
)
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO data.notifications_comments (uid, notification_uid, comment, event_dt, "user")
    VALUES (uuid_generate_v4(), p_notification_uid, p_comment, NOW(), p_user);
    
    UPDATE data.users_notifications
    SET read_dt = NULL
    WHERE notification_uid = p_notification_uid;
END
$$;

GRANT ALL ON FUNCTION data.notifications_comments_send TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createNotificationsCommentsRemoveFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.notifications_comments_remove(
    p_comment_uid UUID,
    p_user text
)
    RETURNS VOID
    LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE data.notifications_comments
    SET is_remove = NOW()
    WHERE uid = p_comment_uid
      and "user" = p_user;

END
$$;

GRANT ALL ON FUNCTION data.notifications_comments_remove TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createNotificationsCommentsListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.notifications_comments_list(
    p_notification_uid UUID
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS
$$
DECLARE
    result JSONB;
BEGIN
    SELECT json_agg(jsonb_build_object(
            'uid', nc.uid,
            'notification_uid', nc.notification_uid,
            'comment', nc.comment,
            'event_dt', nc.event_dt,
            'user', nc.user
        ))
    INTO result
    FROM data.notifications_comments AS nc
    WHERE nc.notification_uid = p_notification_uid
      AND nc.is_remove is null;

    if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END
$$;

GRANT ALL ON FUNCTION data.notifications_comments_list TO ytineres_user;
`
    };
}
