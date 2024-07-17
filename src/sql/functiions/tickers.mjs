/**
 *
 * @returns {SqlFunction}
 */
export function createTickerNewFunc() {
    return {
        query: `
CREATE OR REPLACE PROCEDURE data.ticker_new(p_ticker text, p_stock_index text, p_native_ticker text, p_currency text,
                                            p_user text)
    LANGUAGE plpgsql
AS
$$
DECLARE
    alter_arr jsonb;
BEGIN

    insert into data.tickers (ticker, stock_index, native_ticker, currency, is_remove, sys_open, sys_close, sys_user)
    values (p_ticker, p_stock_index, p_native_ticker, p_currency, false, now(), null, p_user);

    perform data.tickers_prices_make_slice(p_ticker, '7685225c-af44-4c1a-9829-81273a2580c2', 'first slice',
                                           '2000-01-01', p_user);

    select data.settings_data_get('eod::alternative_names_shares')
    into alter_arr;

    perform data.settings_data_update('eod::alternative_names_shares', alter_arr  ||
                                                                       jsonb_build_object('bloomberg', upper(p_ticker),
                                                                                          'alter',
                                                                                          common.get_alter_name('eodHistory', p_ticker)),
                                      false, p_user);

END
$$;

GRANT ALL ON PROCEDURE data.ticker_new TO ytineres_user;
`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createTickerUpdateFunc() {
    return {
        query: `
CREATE OR REPLACE PROCEDURE data.ticker_update(p_ticker text, p_stock_index text, p_native_ticker text,
                                                p_currency text, p_user text, p_is_remove boolean)
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM data.tickers WHERE ticker = p_ticker and sys_close is null) THEN 
        RAISE EXCEPTION 'не найден тикер для обновления';
    END IF; 

    update data.tickers
    set sys_close = now()
    where ticker = p_ticker
      and sys_close is null;

    insert into data.tickers (ticker, stock_index, native_ticker, currency, is_remove, sys_open, sys_close, sys_user)
    values (p_ticker, p_stock_index, p_native_ticker, p_currency, p_is_remove, now(), null, p_user);

END
$$;
GRANT ALL ON PROCEDURE data.ticker_update TO ytineres_user;
`
    };
}


/**
 *
 * @returns {SqlFunction}
 */
export function createTickerListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_list(p_is_active boolean)
    RETURNS jsonb
    LANGUAGE plpgsql
AS
$$
DECLARE
    result jsonb;
Begin
    select jsonb_agg(jsonb_build_object('ticker', t.ticker, 'stock_index', t.stock_index,
                                       'native_ticker', t.native_ticker, 'currency', t.currency))
    INTO result
    from data.tickers as t
    where sys_close is null
      and is_remove = not p_is_active;
      
    if result is null then
        result = '[]'::jsonb;
    end if;

    return result;
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
export function createTickerListWithMarketsFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION data.tickers_list_with_markets(p_is_active boolean)
    RETURNS  jsonb
    LANGUAGE plpgsql
AS
$$
DECLARE result jsonb;
Begin
    select jsonb_agg(
    jsonb_build_object('ticker', jsonb_build_object('ticker', t.ticker, 'stock_index', t.stock_index,
        'native_ticker', t.native_ticker, 'currency', t.currency ),
        'market', jsonb_build_object('market', m.market))
    )
    into result
    from data.tickers as t
    inner join data.indices as i on i.index = t.stock_index and i.sys_close is null
    inner join data.markets as m on m.market = i.market and m.sys_close is null
    where t.sys_close is null
      and t.is_remove = not p_is_active;

    if result is null then
        result = '[]'::jsonb;
    end if;

    return result;
END
$$;
GRANT ALL ON FUNCTION data.tickers_list_with_markets TO ytineres_user;
`
    };
}


