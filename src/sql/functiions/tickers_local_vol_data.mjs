/**
 *
 * @returns {SqlFunction}
 */
export function createTickersLocalVolDataSaveFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_local_vol_data_save(
    p_creator text,
    p_date date,
    p_ticker text,
    p_data JSONB,
    p_is_force boolean
)
    RETURNS UUID
    LANGUAGE plpgsql
AS
$$
DECLARE
    new_uid UUID;
    event_dt TIMESTAMPTZ;
BEGIN
    new_uid = uuid_generate_v4();
    event_dt = now();

    IF p_is_force != true and exists(SELECT 1
                                         FROM data.tickers_local_data
                                         WHERE ticker = p_ticker and date = p_date and sys_close is null) THEN
        RAISE EXCEPTION '::custom:: 409 На указанную дату в базе уже есть записи';
    END IF;


    UPDATE data.tickers_local_data
    SET sys_close = event_dt
    WHERE ticker = p_ticker
      and date = p_date
      and sys_close is null;

    INSERT INTO data.tickers_local_data (uid, ticker, date, data, sys_open, sys_close, sys_user)
    VALUES (new_uid, p_ticker, p_date, p_data, event_dt, null, p_creator);

    return new_uid;

END;
$$;

GRANT ALL ON FUNCTION data.tickers_local_vol_data_save TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickersLocalVolDataGetFunc() {
    return {
        query: `

CREATE OR REPLACE FUNCTION data.tickers_local_vol_data_get(
    p_uid UUID
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT   jsonb_set(n.data, '{date}', to_jsonb(n.date) )
    INTO result
    FROM data.tickers_local_data AS n
    WHERE n.uid = p_uid;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.tickers_local_vol_data_get TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickersLocalVolDataListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_local_vol_data_list(
    p_ticker text 
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS
$$
DECLARE
    result JSONB := '[]'::jsonb;
BEGIN

    SELECT json_agg(jsonb_build_object(
            'uid', l.uid,
            'date', l.date,
            'event_dt', l.sys_open,
            'creator', util.get_user_initials(u.last_name, u.first_name, u.middle_name)
                    ))
    INTO
        result
    FROM data.tickers_local_data AS l
             inner join common.users as u on u.id = l.sys_user and u.sys_close is null
    where l.ticker = p_ticker and l.sys_close is null;


    IF result IS NULL THEN
        result = '[]'::jsonb;
    END IF;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.tickers_local_vol_data_list TO ytineres_user;
`
    };
}
