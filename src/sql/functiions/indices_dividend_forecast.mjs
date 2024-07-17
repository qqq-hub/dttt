/**
 *
 * @returns {SqlFunction}
 */
export function createIndicesDividendForecastUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.indices_dividend_forecast_update(
    p_index TEXT,
    p_date DATE,
    p_value FLOAT,
    p_sys_user TEXT
)
    RETURNS void
    LANGUAGE plpgsql
AS $$
DECLARE
    item jsonb;
BEGIN
    -- Создаем JSON объект для каждой записи данных
    item := jsonb_build_object(
            'index', p_index,
            'date', p_date,
            'value', p_value
        );

    -- Вызываем метод для обновления данных с JSON массивом
    PERFORM data.indices_dividend_forecast_update_many(jsonb_build_array(item), p_sys_user);
END;
$$;

GRANT ALL ON FUNCTION data.indices_dividend_forecast_update TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createIndicesDividendForecastUpdateManyFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.indices_dividend_forecast_update_many(
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

    with cte_items(index, date, value) as (SELECT (item ->> 'index')::text  as index,
                                                  (item ->> 'date')::DATE   as date,
                                                  (item ->> 'value')::FLOAT as value
                                           FROM jsonb_array_elements(p_data) AS item),
         cte_update as (
             UPDATE data.indices_dividend_forecast AS ipr
                 SET
                     sys_close = cur_dt
                 FROM cte_items AS ti
                 WHERE ipr.index = ti.index AND ipr.date = ti.date AND ipr.sys_close IS null
             RETURNING ipr.index)
                 
    INSERT
    INTO data.indices_dividend_forecast (index, date, value, sys_open, sys_close, sys_user)
    SELECT ti.index,
           ti.date,
           ti.value,
           cur_dt,
           NULL,
           p_sys_user
    FROM cte_items AS ti
    left  join cte_update as u on u.index = ti.index; -- Делаем бессмысленный left join, чтоб выражение cte_update выполнилось раньше insert

    RETURN;
END
$$;

GRANT ALL ON FUNCTION data.indices_dividend_forecast_update_many TO ytineres_user;
`
    };
}


/**
 *
 * @returns {SqlFunction}
 */
export function createIndicesDividendForecastRemoveFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.indices_dividend_forecast_remove(
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

    With cte_items(index, date) as
             (SELECT (item ->> 'index')::TEXT AS index,
                     (item ->> 'date')::DATE  AS date
              FROM jsonb_array_elements(p_data) AS item),
         cte_old_items(index, date, value) as (select ipr.index, ipr.date, ipr.value
                                               from cte_items as i
                                                        inner JOIN data.indices_dividend_forecast AS ipr
                                                                   ON i.index = ipr.index AND i.date = ipr.date and sys_close is null),
         cte_update as (
             -- Обновляем текущие записи, ставим sys_close = NOW()
             UPDATE data.indices_dividend_forecast AS ipr
                 SET sys_close = cur_dt
                 FROM cte_items AS ti
                 WHERE ipr.index = ti.index AND ipr.date = ti.date AND ipr.sys_close IS NULL
             RETURNING ipr.index)
                 
    INSERT
    INTO data.indices_dividend_forecast (index, date, value, sys_open, sys_close, sys_user)
    SELECT ti.index,
           ti.date,
           ti.value,
           cur_dt,
           cur_dt,
           p_sys_user
    FROM cte_old_items AS ti
    left  join cte_update as u on u.index = ti.index; -- Делаем бессмысленный left join, чтоб выражение cte_update выполнилось раньше insert

    RETURN;
END
$$;


GRANT ALL ON FUNCTION data.indices_dividend_forecast_remove TO ytineres_user;
`
    };
}


/**
 *
 * @returns {SqlFunction}
 */
export function createIndicesDividendForecastListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.indices_dividend_forecast_list(p_index text)
    RETURNS jsonb
    LANGUAGE plpgsql
AS
$$
DECLARE
    result jsonb;
BEGIN
    SELECT json_agg(jsonb_build_object('date', df.date, 'value', df.value))
    INTO result
    FROM data.indices AS i
             inner join data.indices_dividend_forecast as df on df.index = i.index and df.sys_close is null
    WHERE i.index = p_index
      and i.sys_close IS NULL
      AND i.is_remove = false;

    if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END
$$;


GRANT ALL ON FUNCTION data.indices_dividend_forecast_list TO ytineres_user;
`
    };
}


