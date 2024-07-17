/**
 *
 * @returns {SqlFunction}
 */
export function createIndicesNewFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.indices_new(
    p_index TEXT,
    p_description TEXT,
    p_market TEXT,
    p_sys_user TEXT
)
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
BEGIN
    -- Вставляем новую запись
    INSERT INTO data.indices (index, description, market, is_remove, sys_open, sys_close, sys_user)
    VALUES (p_index, p_description, p_market, false, NOW(), null, p_sys_user);
END;
$$;

GRANT ALL ON FUNCTION data.indices_new TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createIndicesUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.indices_update(
    p_index TEXT,
    p_description TEXT,
    p_market TEXT,
    p_is_remove BOOLEAN,
    p_user TEXT
)
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM data.indices WHERE index = p_index and sys_close is null) THEN 
        RAISE EXCEPTION 'не найден индекс для обновления';
    END IF; 
    
    UPDATE data.indices
    SET sys_close = NOW()
    WHERE index = p_index AND sys_close IS NULL;

    -- Вставляем новую запись
    INSERT INTO data.indices (index, description, market, is_remove, sys_open, sys_close, sys_user)
    VALUES (p_index, p_description, p_market, p_is_remove, NOW(), null, p_user);
END;
$$;

GRANT ALL ON FUNCTION data.indices_update TO ytineres_user;
`
    };
}


/**
 *
 * @returns {SqlFunction}
 */
export function createIndicesListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.indices_list(p_is_active BOOLEAN)
    RETURNS jsonb
    LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT json_agg(jsonb_build_object('index', i.index, 'description', i.description,
                                       'market', i.market))
    INTO result
    FROM data.indices AS i
    WHERE i.sys_close IS NULL AND i.is_remove = NOT p_is_active;

    if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.indices_list TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createIndicesForErFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.indices_for_er(p_date date)
    RETURNS jsonb
    LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT json_agg(jsonb_build_object('index', i.index, 'price_return', pr.value,
                                       'div_forecast', df.value))
    INTO result
    FROM data.indices AS i
    inner join data.indices_price_return as pr on pr.index =i.index and pr.date = p_date and pr.sys_close is null
    inner join data.indices_dividend_forecast as df on df.index = i.index and df.date = p_date and df.sys_close is  null
    WHERE i.sys_close IS NULL AND i.is_remove = false;

    if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END
$$;

GRANT ALL ON FUNCTION data.indices_for_er TO ytineres_user;
`
    };
}


