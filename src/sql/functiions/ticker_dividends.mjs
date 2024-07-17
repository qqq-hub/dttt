/**
 *
 * @returns {SqlFunction}
 */
export function createTickerDividendsUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.ticker_dividends_update(
    p_data jsonb,
    p_sys_user TEXT
)
RETURNS void
LANGUAGE plpgsql
AS
$$
DECLARE
    cur_dt timestamptz;
BEGIN
    cur_dt := now();

   WITH cte_items (ticker, value, date) AS (
    SELECT 
        (item ->> 'ticker')::TEXT AS ticker,
        (item ->> 'value')::FLOAT AS value,
        (item ->> 'date')::DATE AS date  -- преобразование в тип данных DATE
    FROM jsonb_array_elements(p_data) AS item
),
cte_update AS (
    UPDATE data.ticker_dividends AS td
    SET sys_close = cur_dt
    FROM cte_items AS t
    WHERE t.ticker = td.ticker AND t.date = td.date AND td.sys_close IS NULL
    RETURNING td.ticker, td.date
)
INSERT INTO data.ticker_dividends (ticker, value, date, sys_open, sys_close, sys_user)
SELECT 
    t.ticker,
    t.value,
    t.date,
    cur_dt,
    NULL,
    p_sys_user
FROM cte_items AS t
LEFT JOIN cte_update AS u ON u.ticker = t.ticker AND u.date = t.date;
END
$$;
GRANT ALL ON FUNCTION data.ticker_dividends_update TO ytineres_user;
`
    };
}
/**
 *
 * @returns {SqlFunction}
 */
export function createTickerDividendsList() {
    return {
        query: `
create or replace function data.ticker_dividends_list(p_date_from date, p_date_to date, p_valid_date date, p_tickers jsonb) returns jsonb
    language plpgsql
as
$$
DECLARE
    result jsonb;
Begin
    with cte_tickers (ticker) as (select distinct (item ->> 'ticker')::text
                                  from jsonb_array_elements(p_tickers) as item)
    select json_agg(jsonb_build_object('ticker', t.ticker, 'date', d.date, 'value', d.value))
    INTO result
    from cte_tickers as t
             inner join data.ticker_dividends as td on td.ticker = t.ticker and td.date >= p_date_from
        and td.date <= p_date_to and td.sys_close is null

             inner join Lateral (select date, value
                                 from data.ticker_dividends
                                 where ticker = t.ticker
                                   and sys_open::date <= p_valid_date
                                   and date = td.date
                                   and ( sys_close is null or sys_close::date > p_valid_date )
                                 ORDER BY date DESC
                                 LIMIT 1) as d on true;

    IF result is null THEN
        RETURN '[]'::jsonb;
    END IF;

    return result;
END
$$;

GRANT ALL ON FUNCTION data.ticker_dividends_list TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickerDividendsLisByTickerFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.ticker_dividends_list_by_ticker(
    p_ticker TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(
               jsonb_build_object(
                   'ticker', td.ticker,
                   'value', td.value,
                   'date', td.date
               )
           )
    INTO result
    FROM data.ticker_dividends td
    WHERE td.ticker = p_ticker
      AND td.sys_close IS NULL;

    IF result IS NULL THEN
        result = '[]'::jsonb;
    END IF;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.ticker_dividends_list_by_ticker TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickerDividendsRemoveFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.ticker_dividends_remove(
    p_data JSONB,
    p_sys_user TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    cur_dt timestamptz;
BEGIN
    cur_dt := now();

    WITH cte_items (ticker, date) AS (
    SELECT 
        (item ->> 'ticker')::TEXT AS ticker,
        (item ->> 'date')::DATE AS date
    FROM jsonb_array_elements(p_data) AS item
),
cte_update AS (
    UPDATE data.ticker_dividends AS td
    SET sys_close = cur_dt
    FROM cte_items AS ti
    WHERE td.ticker = ti.ticker AND td.date = ti.date AND td.sys_close IS NULL
    RETURNING td.ticker, td.date
)
   
    INSERT INTO data.ticker_dividends (ticker, value, date, sys_open, sys_close, sys_user)
    SELECT
        ti.ticker,
        td.value,
        ti.date,
        cur_dt,
        cur_dt,
        p_sys_user
    FROM cte_items AS ti
    JOIN data.ticker_dividends AS td ON ti.ticker = td.ticker AND ti.date = td.date;

    RETURN;
END
$$;
GRANT ALL ON FUNCTION data.ticker_dividends_remove TO ytineres_user;
`
    };
}
