/**
 *
 * @returns {SqlFunction}
 */
export function createTickersMonthDataUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_month_data_update(
    p_mmYYYY VARCHAR(6),
    p_data JSONB,
    p_sys_user TEXT
)
    RETURNS VOID
    LANGUAGE plpgsql
AS
$$
BEGIN
    CREATE TEMP TABLE temp_items ON COMMIT DROP AS
    SELECT
        (item ->> 'ticker')::text as ticker,
        (item ->> 'best_edps_cur_yr')::FLOAT as best_edps_cur_yr,
        (item ->> 'beta_raw')::FLOAT as beta_raw
    from jsonb_array_elements(p_data) as item;

    -- Обновляем текущие записи, ставим sys_close = NOW()
    UPDATE data.tickers_month_data as data
    SET sys_close = NOW()
    FROM temp_items AS t
    WHERE t.ticker = data.ticker AND  data.mmYYYY = p_mmYYYY AND data.sys_close IS null;

    INSERT
    INTO data.tickers_month_data (ticker, mmYYYY, best_edps_cur_yr, beta_raw, sys_open, sys_close, sys_user)
    SELECT t.ticker,
           p_mmYYYY,
           t.best_edps_cur_yr,
           t.beta_raw,
           NOW(),
           NULL,
           p_sys_user
    FROM temp_items as t;

    RETURN;
END
$$;
GRANT ALL ON FUNCTION data.tickers_month_data_update TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickersMonthDataRemoveFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_month_data_remove(
    p_mmYYYY VARCHAR(6),
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

    CREATE TEMP TABLE temp_tickers ON COMMIT DROP AS
    select ticker.ticker, md.best_edps_cur_yr, md.beta_raw
    from (SELECT ticker_name::TEXT AS ticker
          FROM jsonb_array_elements_text(p_data) AS ticker_name) as ticker
             INNER JOIN data.tickers_month_data AS md
                        ON md.ticker = ticker.ticker and md.mmyyyy = p_mmYYYY and md.sys_close is null;

    -- Обновляем текущие записи, ставим sys_close = NOW()
    UPDATE data.tickers_month_data AS data
    SET sys_close = cur_dt
    FROM temp_tickers AS t
    WHERE t.ticker = data.ticker
      AND p_mmYYYY = data.mmYYYY
      AND data.sys_close IS NULL;

    -- Вставляем новые записи
    INSERT INTO data.tickers_month_data (ticker, mmYYYY, best_edps_cur_yr, beta_raw, sys_open, sys_close, sys_user)
    SELECT t.ticker,
           p_mmYYYY,
           t.best_edps_cur_yr,
           t.beta_raw,
           cur_dt,
           cur_dt,
           p_sys_user
    FROM temp_tickers AS t;

    RETURN;
END
$$;

GRANT ALL ON FUNCTION data.tickers_month_data_remove TO ytineres_user;
`
    };
}


/**
 *
 * @returns {SqlFunction}
 */
export function createTickersMonthDataListForUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_month_data_list_for_update(
    p_mmYYYY VARCHAR(6)
)
    RETURNS JSONB
    LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
      with cte_empty_tickers as (select t.ticker, t.stock_index, t.native_ticker, t.currency
                               from data.tickers as t
                                        left join data.tickers_month_data as md
                                                  on md.ticker = t.ticker and md.mmyyyy = p_mmYYYY and md.sys_close is null
                               where t.sys_close is null
                                 and t.is_remove = false
                                 and md.ticker is null)
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
GRANT ALL ON FUNCTION data.tickers_month_data_list_for_update TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickersMonthDataListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_month_data_list(p_mmYYYY VARCHAR(6))
    RETURNS JSONB
    LANGUAGE plpgsql
AS
$$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(
                   jsonb_build_object(
                           'ticker', t.ticker,
                           'mmYYYY', p_mmYYYY,
                           'beta_raw', md.beta_raw,
                           'best_edps_cur_yr', md.best_edps_cur_yr
                       )
               )
    INTO result
    FROM data.tickers t
             JOIN data.tickers_month_data md ON t.ticker = md.ticker AND md.mmyyyy = p_mmYYYY AND md.sys_close IS NULL
    WHERE t.is_remove = false
      AND t.sys_close IS NULL;
    
    if result is null then
        result = '[]'::jsonb;
    end if;


    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.tickers_month_data_list TO ytineres_user;
`
    };
}




