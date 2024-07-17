/**
 *
 * @returns {SqlFunction}
 */
export function createSettingsDataUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.settings_data_update(
    p_type data.settings_type,
    p_meta JSONB,
    p_is_remove BOOLEAN,
    p_sys_user TEXT
)
    RETURNS void
    LANGUAGE plpgsql
AS $$
BEGIN
    -- Обновляем существующую запись (если есть) и ставим sys_close=NOW()
    UPDATE data.settings_data
    SET sys_close = NOW()
    WHERE type = p_type AND sys_close IS NULL;

    -- Вставляем новую запись
    INSERT INTO data.settings_data (type, meta, is_remove, sys_open, sys_close, sys_user)
    VALUES (p_type, p_meta, p_is_remove, NOW(), NULL, p_sys_user);
END
$$; 

GRANT EXECUTE ON FUNCTION data.settings_data_update TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createSettingsDataGetFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.settings_data_get(p_type data.settings_type)
    RETURNS JSONB
    LANGUAGE plpgsql
AS
$$
DECLARE
    result JSONB;
BEGIN
    SELECT s.meta
    INTO result
    FROM data.settings_data s
    WHERE s.type = p_type
      AND s.sys_close IS NULL
      AND s.is_remove = false
    LIMIT 1;

    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION data.settings_data_get TO ytineres_user;
`
    };
}


