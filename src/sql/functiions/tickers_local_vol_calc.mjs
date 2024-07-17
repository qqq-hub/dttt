/**
 *
 * @returns {SqlFunction}
 */
export function createTickersLocalVolCalcSaveFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_local_vol_calc_save(
    p_creator text,
    p_data_uid uuid,
    p_data JSONB
)
    RETURNS void
    LANGUAGE plpgsql
AS
$$
DECLARE
    event_dt TIMESTAMPTZ;
BEGIN
    event_dt = now();

    UPDATE data.tickers_local_calc
    SET sys_close = event_dt
    WHERE uid_data = p_data_uid
      and sys_close is null;

    INSERT INTO data.tickers_local_calc (uid_data, data, sys_open, sys_close, sys_user)
    VALUES (p_data_uid, p_data, event_dt, null, p_creator);
END;
$$;


GRANT ALL ON FUNCTION data.tickers_local_vol_calc_save TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickersLocalVolCalcGetByTickersFunc() {
    return {
        query: `

create or replace function data.tickers_local_vol_calc_get_by_tickers(p_tickers jsonb, p_dateFrom text, p_dateTo text) returns jsonb
    language plpgsql
as
$$
DECLARE
    result jsonb;
Begin

    select jsonb_agg(jsonb_build_object('ticker', d.ticker, 'date', d.date, 'data', c.data))
    into result
    from jsonb_array_elements_text(p_tickers) as t
             inner join data.tickers_local_data as d on d.ticker = t and  d.sys_close is null
             inner join data.tickers_local_calc as c
                        on d.uid = c.uid_data and c.sys_close is null and c.sys_open >= p_dateFrom::date and c.sys_open <= p_dateTo::date;

    IF result is null THEN
        result = '[]'::jsonb;
    END IF;

    return result;
END
$$;


GRANT ALL ON FUNCTION data.tickers_local_vol_calc_get_by_tickers TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickersLocalVolCalcGetFunc() {
    return {
        query: `

CREATE OR REPLACE FUNCTION data.tickers_local_vol_calc_get(
    p_uid UUID
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT   n.data
    INTO result
    FROM data.tickers_local_calc AS n
    WHERE n.uid_data = p_uid and sys_close is null;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.tickers_local_vol_calc_get TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickersLocalVolCalcGetPreCalcDataFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_local_vol_calc_get_pre_calc_data(
    p_uid UUID
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS
$$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_set(jsonb_set(
                             jsonb_set(n.data, '{ticker}', to_jsonb(n.ticker)),
                             '{date}', to_jsonb(n.date)
                     ), '{spot}', CASE
                                      WHEN p.value IS NULL THEN 'null'::jsonb
                                      ELSE to_jsonb(p.value)
                         END
           )
    INTO result
    FROM data.tickers_local_data AS n
             left join data.tickers_prices as p on p.ticker = n.ticker and p.sys_close is null and p.date = n.date
    WHERE n.uid = p_uid
      and n.sys_close is null;

    RETURN result;
END
$$;

GRANT ALL ON FUNCTION data.tickers_local_vol_calc_get_pre_calc_data TO ytineres_user;
`
    };
}
