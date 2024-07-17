/**
 *
 * @returns {SqlFunction}
 */
export function createExpectedReturnUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.expected_return_update(
    p_mmYYYY VARCHAR(6),
    p_type data.expected_return_type,
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

    with cte_items (ticker, er) as (SELECT (item ->> 'ticker')::TEXT AS ticker,
                                           (item ->> 'er')::FLOAT    AS er
                                    FROM jsonb_array_elements(p_data) AS item),

         cte_update as (UPDATE data.expected_return AS er
             SET sys_close = cur_dt
             FROM cte_items AS t
             WHERE t.ticker = er.ticker AND er.mmyyyy = p_mmYYYY AND er."type" = p_type AND er.sys_close IS NULL
             RETURNING er.ticker)
    INSERT
    INTO data.expected_return (ticker, er, type, mmyyyy, sys_open, sys_close, sys_user)
    SELECT t.ticker,
           t.er,
           p_type,
           p_mmYYYY,
           cur_dt,
           NULL,
           p_sys_user
    FROM cte_items AS t
    left  join cte_update as u on u.ticker = t.ticker; -- Делаем бессмысленный left join, чтоб выражение cte_update выполнилось раньше insert
END
$$;
GRANT ALL ON FUNCTION data.expected_return_update TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createExpectedReturnRemoveFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.expected_return_remove(
    p_mmYYYY VARCHAR(6),
    p_type data.expected_return_type,
    p_data JSONB,
    p_sys_user TEXT
)
    RETURNS VOID
    LANGUAGE plpgsql
AS
$$
DECLARE
    cur_dt timestamptz;
BEGIN
    cur_dt := now();

    with cte_tickers(ticker) as (SELECT ticker_name::TEXT AS ticker
                                 FROM jsonb_array_elements_text(p_data) AS ticker_name),
         cte_oldtickers(ticker, er) as (select t.ticker, er.er
                                        from cte_tickers as t
                                                 inner join data.expected_return as er
                                                            on er.ticker = t.ticker and er.type = p_type and
                                                               mmyyyy = p_mmYYYY and er.sys_close is null)
            ,
         cte_updte as (
             UPDATE data.expected_return AS er
                 SET sys_close = cur_dt
                 FROM cte_tickers AS t
                 WHERE t.ticker = er.ticker AND er.mmyyyy = p_mmYYYY AND er."type" = p_type AND er.sys_close IS NULL)
    INSERT
    INTO data.expected_return (ticker, er, type, mmyyyy, sys_open, sys_close, sys_user)
    SELECT t.ticker,
           t.er,
           p_type,
           p_mmYYYY,
           cur_dt,
           cur_dt,
           p_sys_user
    FROM cte_oldtickers AS t;

    RETURN;
END
$$;
GRANT ALL ON FUNCTION data.expected_return_remove TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createExpectedReturnListForUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.expected_return_list_for_update(
    p_mmYYYY VARCHAR(6),
    p_type data.expected_return_type
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS
$$
DECLARE
    result JSONB;
BEGIN
    with cte_empty_tickers as (select t.ticker, t.stock_index, t.native_ticker, t.currency
                               from data.tickers as t
                                        left join data.expected_return as er
                                                  on er.ticker = t.ticker and er.type = p_type and
                                                     er.mmyyyy = p_mmYYYY and er.sys_close is null
                               where t.sys_close is null
                                 and t.is_remove = false
                                 and er.ticker is null)
    select jsonb_agg(
                   jsonb_build_object(
                           'ticker', t.ticker,
                           'stock_index', t.stock_index,
                           'native_ticker', t.native_ticker,
                           'currency', t.currency
                       )
               )
    INTO result
    from cte_empty_tickers as t;

    if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.expected_return_list_for_update TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createExpectedReturnListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.expected_return_list(
    p_mmYYYY VARCHAR(6),
    p_type data.expected_return_type,
    p_tickers JSONB
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS
$$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(
                   jsonb_build_object(
                           'ticker', e.ticker,
                           'er', e.er,
                           'mmYYYY', e.mmYYYY
                       )
               )
    INTO result
    FROM jsonb_array_elements(p_tickers) AS t
             INNER JOIN data.expected_return e
                        ON e.ticker = (t ->> 'ticker')::TEXT and e.mmYYYY = p_mmYYYY AND e.type = p_type AND
                           e.sys_close IS NULL;

    if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END
$$;

GRANT ALL ON FUNCTION data.expected_return_list TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createExpectedReturnLisByTickerFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.expected_return_list_by_ticker(
    p_ticker TEXT,
    p_type data.expected_return_type
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(
                   jsonb_build_object(
                           'ticker', e.ticker,
                           'er', e.er,
                           'mmYYYY', e.mmYYYY
                       )
               )
    INTO result
    FROM data.expected_return e
    WHERE e.ticker = p_ticker
      AND e.type = p_type
      AND e.sys_close IS NULL;

    if result is null then
        result = '[]'::jsonb;
    end if;


    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.expected_return_list_by_ticker TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createExpectedReturnListIsDataHasFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.expected_return_list_is_data_has(p_mmYYYY text, p_type data.expected_return_type, p_items jsonb)
    RETURNS boolean AS
$$
BEGIN
    -- Поиск тикеров по индексам из массива items
    RETURN EXISTS (with cte_indices (index) as (select (i ->> 'index')
                                                from jsonb_array_elements(p_items) as i)
                   select 1
                   from cte_indices as i
                            inner join data.tickers as t
                                       on t.stock_index = i.index and t.sys_close is null and t.is_remove = false
                            inner join data.expected_return as er
                                       on er.ticker = t.ticker and er.mmyyyy = p_mmYYYY and
                                          er.type = p_type and
                                          er.sys_close is null);
END;
$$ LANGUAGE plpgsql;
GRANT ALL ON FUNCTION data.expected_return_list_is_data_has TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createErRiskRateAutoUpdate() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.er_risk_rate_auto_update(
    p_mmYYYY VARCHAR(6),
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

    with cte_items (ticker, index) as (SELECT t.ticker AS ticker, t.stock_index as index
                                       FROM jsonb_array_elements(p_data) AS item
                                                inner join data.tickers as t on t.ticker = (item ->> 'ticker')::TEXT and
                                                                                t.sys_close is null and
                                                                                t.is_remove = false),

         cte_update as (UPDATE data.expected_return AS er
             SET sys_close = cur_dt
             FROM cte_items AS t
             WHERE t.ticker = er.ticker AND er.mmyyyy = p_mmYYYY AND er."type" = '6G0UUr8GV4ZlLg_7G71DU' AND
                   er.sys_close IS NULL
             RETURNING er.ticker)
    INSERT
    INTO data.expected_return (ticker, er, type, mmyyyy, sys_open, sys_close, sys_user)
    SELECT t.ticker,
           er.er,
           '6G0UUr8GV4ZlLg_7G71DU',
           p_mmYYYY,
           cur_dt,
           NULL,
           p_sys_user
    FROM cte_items AS t
             inner join LATERAL (
        select er
        from data.tickers as _t
                 inner join data.expected_return as _er on _er.ticker = _t.ticker
        where _t.stock_index = t.index
          and _er.sys_close is null
          and _er.mmyyyy = p_mmYYYY
          and _er.type = '6G0UUr8GV4ZlLg_7G71DU'
        order by _er.sys_open DESC
        limit 1 ) as er on true
             left join cte_update as u on u.ticker = t.ticker; -- Делаем бессмысленный left join, чтоб выражение cte_update выполнилось раньше insert
END
$$;
			
GRANT ALL ON FUNCTION data.er_risk_rate_auto_update TO ytineres_user;
`
    };
}
