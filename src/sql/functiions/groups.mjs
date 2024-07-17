/**
 *
 * @returns {SqlFunction}
 */
export function createGroupsNewFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.groups_new(p_name TEXT, p_description TEXT, p_user TEXT)
RETURNS VOID AS
$$
DECLARE
    max_id INTEGER;
BEGIN
    SELECT COALESCE(MAX(id), 0) + 1 INTO max_id FROM common.groups;
    
    INSERT INTO common.groups (id, name, description, is_remove, sys_open, sys_user)
    VALUES (max_id, p_name, p_description, FALSE, NOW(), p_user);
END;
$$
LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.groups_new TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createGroupsListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.groups_list(p_is_active BOOLEAN)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    select jsonb_agg(jsonb_build_object('id', g.id, 'name', g.name, 'description', g.description, 'is_remove', g.is_remove))
    INTO result
    FROM common.groups AS g
    WHERE sys_close IS NULL AND is_remove = NOT p_is_active;
   
   if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END
$$;

GRANT ALL ON FUNCTION common.groups_list TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createGroupsUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.groups_update(
    p_id INTEGER,
    p_name TEXT,
    p_description TEXT,
    p_is_remove BOOLEAN,
    p_user TEXT
)
RETURNS VOID AS $$
DECLARE
    cur_dt timestamptz;
BEGIN
    cur_dt := now();

    UPDATE common.groups
    SET
        sys_close = cur_dt
    WHERE
        id = p_id AND sys_close IS NULL;

    INSERT INTO common.groups
        (id, name, description, is_remove, sys_open, sys_close, sys_user)
    VALUES
        (p_id, p_name, p_description, p_is_remove, cur_dt, NULL, p_user);
END;
$$ LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.groups_update TO ytineres_user;
`
    };
}
