/**
 *
 * @returns {SqlFunction}
 */
export function createTickerPricesDayListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_prices_day_list(p_type data.tickers_type, p_valid_date date, p_date_from date,
                                                        p_date_to date, p_tickers jsonb)
    RETURNS jsonb
    LANGUAGE plpgsql
AS
$$
DECLARE
    result jsonb;
Begin

    with cte_tickers (ticker) as (select distinct (item->>'ticker')::text from jsonb_array_elements(p_tickers) as item)
    select jsonb_agg(jsonb_build_object('ticker', h.ticker, 'value', h.value, 'date', h.date))
    into result
    from cte_tickers as t
             inner join data.tickers_prices_slices as ts on ts.ticker = t.ticker and ts.type = p_type and
                                                            ts.valid_from <=p_valid_date and p_valid_date<ts.valid_to and
                                                            ts.sys_close is null
             inner join data.tickers_prices as h
                        on h.slice_uid = ts.uid and h.ticker = t.ticker
                            and h.date between p_date_from and LEAST(p_date_to, ts.valid_to)
                            and h.sys_close is null;
    if result is null then
        result = '[]'::jsonb;
    end if;

    return result;
END
$$;

GRANT ALL ON FUNCTION data.tickers_prices_day_list TO ytineres_user;

`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickerPricesUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_prices_update(
    p_type data.tickers_type,
    p_data jsonb,
    p_sys_user text
)
    RETURNS void
    LANGUAGE plpgsql
AS
$$
DECLARE
    cur_dt timestamptz;
BEGIN
    cur_dt := now();

    -- Создание временной таблицы
    CREATE TEMP TABLE temp_items ON COMMIT DROP AS
    SELECT
        (i ->> 'ticker')::text AS ticker,
        (i ->> 'date')::date   AS date,
        (i ->> 'value')::float AS value,
        ts.uid                 as slice_uid
    FROM
        jsonb_array_elements(p_data) AS i
    INNER JOIN
        data.tickers_prices_slices AS ts
    ON
        ts.ticker = (i ->> 'ticker')::text AND
        ts.type = p_type AND
        sys_close IS NULL AND
        ts.valid_to = 'infinity';

    -- Выполнение инструкции UPDATE
    UPDATE data.tickers_prices AS h
    SET sys_close = cur_dt
    FROM temp_items AS i
    INNER JOIN data.tickers_prices_slices AS ts
    ON ts.uid = i.slice_uid AND ts.type = p_type
    WHERE
        i.slice_uid IS NOT NULL AND
        h.ticker = i.ticker AND
        h.slice_uid = i.slice_uid AND
        h.date = i.date AND
        h.sys_close IS NULL;

    -- Выполнение инструкции INSERT
    INSERT INTO data.tickers_prices
        (ticker, value, date, slice_uid, sys_open, sys_close, sys_user)
    SELECT
        i.ticker,
        i.value,
        i.date,
        i.slice_uid,
        cur_dt,
        NULL,
        p_sys_user
    FROM temp_items AS i;
END;
$$;
GRANT ALL ON FUNCTION data.tickers_prices_update TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickerPricesMonthListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_prices_month_list(p_type data.tickers_type, p_valid_date date, p_date_from date,
                                                          p_date_to date, p_tickers jsonb)
    RETURNS jsonb
    LANGUAGE plpgsql
AS
$$
DECLARE
    result jsonb;
Begin

    with cte_tickers (ticker) as (select distinct (item->>'ticker')::text from jsonb_array_elements(p_tickers) as item),
         cte_tickers_days(ticker, date, value) as (select t.ticker, h.date, h.value
                                                   from cte_tickers as t
                                                            inner join data.tickers_prices_slices as ts
                                                                       on ts.ticker = t.ticker and ts.type = p_type and
																																					ts.valid_from <=p_valid_date and p_valid_date<ts.valid_to and
                                                                          ts.sys_close is null
                                                            inner join data.tickers_prices as h
                                                                       on h.slice_uid = ts.uid and
                                                                          h.ticker = t.ticker and
                                                                          h.date between p_date_from and LEAST(p_date_to, ts.valid_to) and
                                                                          h.sys_close is null),
         cte_tickers_months(ticker, max_date) as (select t.ticker, max(t.date)
                                                  from cte_tickers_days as t
                                                  GROUP BY t.ticker, EXTRACT(YEAR FROM t.date),
                                                           EXTRACT(MONTH FROM t.date))

    select jsonb_agg(jsonb_build_object('ticker', d.ticker, 'value', d.value, 'date', d.date))
    into result
    from cte_tickers_months as m
             inner join cte_tickers_days as d on m.ticker = d.ticker and m.max_date = d.date;
             
    if result is null then
        result = '[]'::jsonb;
    end if;

    return result;
END
$$;
GRANT ALL ON FUNCTION data.tickers_prices_month_list TO ytineres_user;

`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickerPricesRemoveFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_prices_remove(p_type data.tickers_type, p_valid_date date, p_date_from date,
                                                      p_date_to date, p_tickers jsonb, p_user text)
    RETURNS void
    LANGUAGE plpgsql
AS
$$
DECLARE
    cur_dt timestamptz;
Begin
    cur_dt = now();
    -- Создание временной таблицы
    CREATE TEMP TABLE temp_items ON COMMIT DROP AS
    SELECT (i ->> 'ticker')::text AS ticker,
           h.date                 as date,
           h.value                as value,
           ts.uid                 as slice_uid
    FROM jsonb_array_elements(p_tickers) AS i
             INNER JOIN
         data.tickers_prices_slices AS ts
         ON
                     ts.ticker = (i ->> 'ticker')::text AND
                     ts.type = p_type AND
                     sys_close IS NULL AND ts.valid_from<= p_valid_date  and p_valid_date< ts.valid_to
             inner join data.tickers_prices as h
                        on h.ticker = ts.ticker and h.sys_close is null and h.date between p_date_from and p_date_to and
                           h.slice_uid = ts.uid;

    UPDATE data.tickers_prices AS h
    SET sys_close = cur_dt
    FROM temp_items AS i
             INNER JOIN data.tickers_prices_slices AS ts
                        ON ts.uid = i.slice_uid AND ts.type = p_type
    WHERE i.slice_uid IS NOT NULL
      AND h.ticker = i.ticker
      AND h.date = i.date
      AND h.sys_close IS NULL;

    INSERT INTO data.tickers_prices
        (ticker, value, date, slice_uid, sys_open, sys_close, sys_user)
    select i.ticker, i.value, i.date, i.slice_uid,  cur_dt,cur_dt, p_user
    from temp_items as i;
END
$$;
GRANT ALL ON FUNCTION data.tickers_prices_remove TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createSlicesByTickerTypeListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.slices_by_ticker_type_list(
    p_ticker text,
    p_type "data".tickers_type
)
RETURNS jsonb
LANGUAGE plpgsql
AS
$$
DECLARE
    result_json jsonb;
BEGIN
    SELECT jsonb_agg(jsonb_build_object(
        'validate_from', valid_from,
        'validate_to', valid_to,
        'event_date', sys_open,
        'comment', "comment",
        'user', 'Неизвестный пользователь'
    ))
    INTO result_json
    FROM "data".tickers_prices_slices
    WHERE ticker = p_ticker
    AND "type" = p_type
    AND sys_close is null;

    if result_json is null then
        result_json = '[]'::jsonb;
    end if;

    return result_json;
END
$$;
GRANT ALL ON FUNCTION data.tickers_list TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickerPricesMakeSliceFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_prices_make_slice(p_ticker text, p_type data.tickers_type, p_comment text,
                                                          p_date date, p_user text)
    RETURNS void
    LANGUAGE plpgsql
AS
$$
DECLARE
    cur_dt    timestamptz;
    prev_date date;
Begin
    cur_dt = now();

    select valid_from
    into prev_date
    from data.tickers_prices_slices as s
    where s.type = p_type
      and s.ticker = p_ticker
      and s.sys_close is null
      and s.valid_to = 'infinity' ;

    if prev_date is not null and prev_date>p_date then
        RAISE EXCEPTION '::custom:: Новая дата слайса не может быть раньше текущего слайса';
    end if;
    update data.tickers_prices_slices as s
    set valid_to = p_date
    where s.type = p_type
      and s.ticker = p_ticker
      and s.sys_close is null;

    insert into data.tickers_prices_slices (uid, comment, ticker, type, valid_from, valid_to, sys_open, sys_close,
                                            sys_user)
    values (uuid_generate_v4(), p_comment, p_ticker, p_type, p_date, 'infinity', cur_dt, null, p_user);

END
$$;
GRANT ALL ON FUNCTION data.tickers_prices_make_slice TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickerPricesWithoutDayPriceFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_prices_without_day_price(p_type data.tickers_type, p_date date)
    RETURNS jsonb
    LANGUAGE plpgsql
AS
$$
DECLARE
    result jsonb;
Begin

    select jsonb_agg(
                   jsonb_build_object('ticker', t.ticker, 'stock_index', t.stock_index,
                                      'native_ticker', t.native_ticker, 'currency', t.currency)
               )
    into result
    from data.tickers as t
             inner join data.tickers_prices_slices as ts on ts.ticker = t.ticker and ts.sys_close is null and
                                                            ts.type = p_type and
                                                            now() between ts.valid_from and ts.valid_to
             left join data.tickers_prices as h
                       on h.slice_uid = ts.uid and h.ticker = ts.ticker and h.sys_close is null and
                          h.date = p_date
    where t.sys_close is null and h.ticker is null and t.is_remove=false;

    if result is null then
        result = '[]'::jsonb;
    end if;

    return result;
END
$$;
GRANT ALL ON FUNCTION data.tickers_prices_without_day_price TO ytineres_user;
`
    };
}
