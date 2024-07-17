/**
 *
 * @returns {SqlFunction}
 */
export function createCurrenciesNewFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.currencies_new(p_short TEXT, p_name TEXT, p_user TEXT)
    RETURNS VOID AS $$
BEGIN
    INSERT INTO data.currencies (short, name, is_remove, sys_open, sys_close, sys_user)
    VALUES (p_short, p_name, false, NOW(), null, p_user);

    RAISE NOTICE 'Currency added successfully';
END;
$$ LANGUAGE plpgsql;

GRANT ALL ON FUNCTION data.currencies_new TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createCurrenciesUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.currencies_update(
    p_short TEXT,
    p_name TEXT,
    p_is_remove BOOLEAN,
    p_user TEXT
)
    RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM data.markets WHERE short = p_short ) THEN 
        RAISE EXCEPTION 'не найден индекс для обновления';
    END IF; 
    
    UPDATE data.currencies
    SET sys_close = NOW()
    WHERE short = p_short AND sys_close IS NULL;

    INSERT INTO data.currencies (short, name, is_remove, sys_open, sys_close, sys_user)
    VALUES (p_short, p_name, p_is_remove, NOW(), null, p_user);
END;
$$ LANGUAGE plpgsql;

GRANT ALL ON FUNCTION data.currencies_update TO ytineres_user;
`
    };
}


/**
 *
 * @returns {SqlFunction}
 */
export function createCurrenciesListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.currencies_list(p_is_active BOOLEAN)
    RETURNS jsonb
    LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT json_agg(jsonb_build_object('short', c.short, 'name', c.name))
    INTO result
    FROM data.currencies AS c
    WHERE sys_close IS NULL AND is_remove = NOT p_is_active;

    if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END
$$;

GRANT ALL ON FUNCTION data.currencies_list TO ytineres_user;
`
    };
}


