/**
 *
 * @returns {SqlFunction}
 */
export function createUsersRightsListByIdFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.users_rights_list_by_id(p_user_id TEXT)
RETURNS JSONB AS
$$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(r."name")
    INTO result
    FROM common.users_rights as ur
    JOIN common.rights as r ON r.id = ur.right_id
    WHERE ur.user_id = p_user_id
      AND r.sys_close IS NULL
      AND ur.sys_close IS NULL;
     
    if result is null then
    result = '[]'::jsonb;
    end if;

    RETURN result;
END;
$$
LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.users_rights_list_by_id TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createUsersRightsNewFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.users_rights_new(p_user_id TEXT, p_right_id TEXT, p_user TEXT)
RETURNS VOID AS
$$
BEGIN
    INSERT INTO common.users_rights (user_id, right_id, sys_open, sys_user)
    VALUES (p_user_id, p_right_id, now(), p_user);

END;
$$
LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.users_rights_new TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createUsersRightsRemoveFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.users_rights_remove(p_user_id TEXT, p_right_id TEXT, p_user TEXT)
RETURNS VOID AS
$$
BEGIN
    UPDATE common.users_rights
    SET sys_close = now()
    WHERE user_id = p_user_id
      AND right_id = p_right_id
      AND sys_close IS NULL;

    INSERT INTO common.users_rights (user_id, right_id, sys_open, sys_close, sys_user)
    VALUES (p_user_id, p_right_id, now(), now(), p_user);

END;
$$
LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.users_rights_remove TO ytineres_user;
`
    };
}
