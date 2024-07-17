/**
 *
 * @returns {SqlFunction}
 */
export function createMarketsNewFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.markets_new(p_market TEXT, p_currency TEXT, p_user TEXT)
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO data.markets (market, currency, is_remove, sys_open, sys_close, sys_user)
    VALUES (p_market, p_currency, false, NOW(), null, p_user);

    RAISE NOTICE 'Market added successfully';
    
END;
$$;
GRANT ALL ON FUNCTION data.markets_new TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createMarketsUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.markets_update(
    p_market TEXT,
    p_currency TEXT,
    p_is_remove BOOLEAN,
    p_user TEXT
)
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM data.markets WHERE market = p_market ) THEN 
        RAISE EXCEPTION 'не найден индекс для обновления';
    END IF; 

    UPDATE data.markets
    SET sys_close = NOW()
    WHERE market = p_market AND sys_close IS NULL;

    -- Вставляем новую запись
    INSERT INTO data.markets (market,currency, is_remove, sys_open, sys_close, sys_user)
    VALUES (p_market, p_currency, p_is_remove, NOW(), null, p_user);
END;
$$;
GRANT ALL ON FUNCTION data.markets_update TO ytineres_user;
`
    };
}


/**
 *
 * @returns {SqlFunction}
 */
export function createMarketsListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.markets_list(p_is_active BOOLEAN)
    RETURNS jsonb
    LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT json_agg(jsonb_build_object('market', m.market, 'currency', m.currency ))
    INTO result
    FROM data.markets AS m
    WHERE sys_close IS NULL AND is_remove = NOT p_is_active;

    if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.markets_list TO ytineres_user;
`
    };
}


