/**
 *
 * @returns {SqlFunction}
 */
export function createUsersNewFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.users_new(
    p_id TEXT,
    p_email TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_middle_name TEXT,
    p_group_id INTEGER,
    p_salt TEXT,
    p_hash TEXT,
    p_user TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Вставляем нового пользователя в таблицу
    INSERT INTO common.users (id, email, first_name, last_name, middle_name, salt, hash, group_id, is_remove, sys_open, sys_close, sys_user)
    VALUES (p_id, p_email, p_first_name, p_last_name, p_middle_name, p_salt, p_hash, p_group_id, FALSE, NOW(), null, p_user);

END;
$$ LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.users_new TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createUsersListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.users_list(
    p_is_active BOOLEAN,
    p_group_id INTEGER DEFAULT NULL
)
    RETURNS JSONB AS
$$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(jsonb_build_object(
            'id', u.id,
            'email', u.email,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'middle_name', u.middle_name,
            'group_id', u.group_id,
            'group_name', g.name
                     ))
    INTO result
    FROM common.users u
             left JOIN common.groups g ON u.group_id = g.id and g.sys_close is null
    WHERE u.sys_close IS NULL
      AND u.is_remove = NOT p_is_active
      AND (p_group_id is null or u.group_id = p_group_id);

    if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.users_list TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createUsersGetByEmailFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.users_get_by_email(p_email TEXT)
RETURNS JSONB AS $$
DECLARE
    user_data JSONB;
BEGIN
    SELECT jsonb_build_object(
        'id', u.id,
        'email', u.email,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'middle_name', u.middle_name,
        'salt', u.salt,
        'hash', u.hash,
        'group_id', u.group_id,
        'is_remove', u.is_remove
    )
    INTO user_data
    FROM common.users u
    WHERE u.email = p_email and sys_close is null;

    RETURN user_data;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        -- Если пользователь с указанным email не найден, возвращаем NULL
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.users_get_by_email TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createUsersUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.users_update(
    p_id TEXT,
    p_email TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_middle_name TEXT,
    p_group_id INTEGER,
    p_salt TEXT,
    p_hash TEXT,
    p_is_remove BOOLEAN,
    p_user TEXT
)
RETURNS VOID AS $$
DECLARE
    cur_dt timestamptz;
BEGIN
    cur_dt := now();

    UPDATE common.users
    SET
        sys_close = cur_dt
    WHERE
        id = p_id  and sys_close is null;

    -- Выполнение инструкции INSERT (добавление новой версии пользователя)
    INSERT INTO common.users
        (id, email, first_name, last_name, middle_name, salt, hash, group_id, is_remove, sys_open, sys_close, sys_user)
    VALUES
        (p_id, p_email, p_first_name, p_last_name, p_middle_name, p_salt, p_hash, p_group_id, p_is_remove, cur_dt, null, p_user);
END;
$$ LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.users_update TO ytineres_user;
`
    };
}
