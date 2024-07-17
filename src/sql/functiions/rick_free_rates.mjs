/**
 *
 * @returns {SqlFunction}
 */
export function createRiskFreeRatesListFunction() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.risk_free_rates_list(
    p_currency TEXT,
    p_date DATE
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    result_json jsonb := '[]'::jsonb; -- Инициализируем пустым JSON-массивом
BEGIN
    -- Заполняем JSON-массив данными
    SELECT json_agg(
        jsonb_build_object(
            'currency', t1.currency,
            'term', t1.term,
            'rate', t1.rate,
            'start_date', t1.start_date
        )
    )
    INTO result_json
    FROM data.risk_free_rates AS t1
    INNER JOIN (
        SELECT currency, MAX(start_date) AS d
        FROM data.risk_free_rates
        WHERE start_date <= p_date
        GROUP BY currency
    ) AS t2 ON t2.currency = t1.currency
              AND t1.start_date = t2.d
    WHERE t1.currency = p_currency
      AND t1.sys_close IS NULL;

    if result_json is null then
    result_json = '[]'::jsonb;
    end if;
    RETURN result_json;
END
$$;
GRANT ALL ON FUNCTION data.risk_free_rates_list TO ytineres_user;
`
    };
}

/**
 * @returns {SqlFunction}
 */
export function createRiskFreeRatesUpdateFunction() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.risk_free_rates_update(
    p_currency TEXT,
    p_start_date DATE,
    p_items JSONB,
    p_user TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    cur_dt TIMESTAMPTZ;
BEGIN
    cur_dt := NOW();

    -- Создаем временную таблицу для хранения значений term и rate
    WITH cte_items(term, rate) AS (
        SELECT 
            (item ->> 'term')::INT as term, 
            (item ->> 'rate')::FLOAT as rate
        FROM JSONB_ARRAY_ELEMENTS(p_items) AS item
    ),
    cte_update AS (
        UPDATE data.risk_free_rates AS r
        SET sys_close = cur_dt
        FROM cte_items AS t
        WHERE r.currency = p_currency
          AND r.start_date = p_start_date
          AND r.sys_close IS NULL
          AND r.term = t.term
        RETURNING r.term
    )
    INSERT INTO data.risk_free_rates (currency, term, rate, start_date, sys_open, sys_close, sys_user)
    SELECT p_currency,
           t.term,
           t.rate,
           p_start_date,
           cur_dt,
           NULL,
           p_user
    FROM cte_items AS t
    LEFT JOIN cte_update AS u ON u.term = t.term;

    RETURN;
END
$$;
GRANT ALL ON FUNCTION data.risk_free_rates_update TO ytineres_user;
        `
    };
}

//не получилось добавить сортировку ORDER BY r1.currency, r1.term
/**
 * @returns {SqlFunction}
 */
export function createRiskFreeRatesGetOnDayFunction() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.risk_free_rates_get_on_day(pointDate DATE)
RETURNS JSONB
LANGUAGE SQL
AS $$
    SELECT jsonb_agg(jsonb_build_object('currency', r1.currency, 'Term', r1.term, 'Rate', r1.rate / 100.0))
    FROM data.risk_free_rates AS r1
    INNER JOIN (
      SELECT currency, MAX(start_date) AS max_start_date
      FROM data.risk_free_rates
      WHERE start_date <= pointDate 
      GROUP BY currency
    ) AS r2
    ON r1.currency = r2.currency AND r1.start_date = r2.max_start_date and sys_close IS null
$$;
GRANT ALL ON FUNCTION data.risk_free_rates_get_on_day TO ytineres_user;
        `
    };
}
