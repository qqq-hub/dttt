/**
 *
 * @returns {SqlFunction}
 */
export function createForwardRatesListFunction() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.forward_rates_list(
    p_date DATE
)
    RETURNS jsonb
    LANGUAGE plpgsql
AS
$$
DECLARE
    result jsonb;
BEGIN
    with cte_max_dates as (SELECT currency1, currency2, MAX(start_date) AS d
                           FROM data.forward_rates
                           WHERE start_date <= p_date
                             and sys_close is null
                           GROUP BY currency1, currency2)
    SELECT json_agg(
                   jsonb_build_object(
                           'currency1', t1.currency1,
                           'currency2', t1.currency2,
                           'value', t1.value,
                           'start_date', t1.start_date
                   )
           )
    INTO result
    FROM data.forward_rates AS t1
             INNER JOIN cte_max_dates AS t2 ON t2.currency1 = t1.currency1 AND
                                               t2.currency2 = t1.currency2 AND
                                               t1.start_date = t2.d
    WHERE t1.sys_close IS NULL;

    IF result IS NULL THEN
        result = '[]'::jsonb;
    END IF;

    RETURN result;
END
$$;
GRANT ALL ON FUNCTION data.forward_rates_list TO ytineres_user;
`
    };
}

/**
 * @returns {SqlFunction}
 */
export function createForwardRatesUpdateFunction() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.forward_rates_update(
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

    -- Создаем временную таблицу для хранения значений currency1, currency2 и value
    WITH cte_items(currency1, currency2, value) AS (
        SELECT
            (item ->> 'currency1')::TEXT as currency1,
            (item ->> 'currency2')::TEXT as currency2,
            (item ->> 'value')::FLOAT as value
        FROM JSONB_ARRAY_ELEMENTS(p_items) AS item
    ),
    cte_update AS (
        UPDATE data.forward_rates AS fr
        SET sys_close = cur_dt
        FROM cte_items AS ti
        WHERE fr.start_date = p_start_date
          AND fr.sys_close IS NULL
          AND fr.currency1 = ti.currency1
          AND fr.currency2 = ti.currency2
        RETURNING fr.currency1, fr.currency2
    )
    INSERT INTO data.forward_rates (currency1, currency2, value, start_date, sys_open, sys_close, sys_user)
    SELECT ti.currency1,
           ti.currency2,
           ti.value,
           p_start_date,
           cur_dt,
           NULL,
           p_user
    FROM cte_items AS ti
    LEFT JOIN cte_update AS u ON u.currency1 = ti.currency1 AND u.currency2 = ti.currency2;

    RETURN;
END
$$;

GRANT ALL ON FUNCTION data.forward_rates_update TO ytineres_user;
`
    };
}
