/**
 *
 * @returns {SqlTable}
 */
export function createTickersPricesTable() {
    return {
        query: `
CREATE TABLE data.tickers_prices (
    ticker VARCHAR NOT NULL,
    value FLOAT NOT NULL,
    date DATE NOT NULL,
    slice_uid UUID not null ,
    sys_open TIMESTAMPTZ NOT NULL,
    sys_close TIMESTAMPTZ,
    sys_user VARCHAR not null 
)PARTITION BY RANGE (sys_close);


CREATE TABLE data.tickers_prices_history PARTITION OF data.tickers_prices
    FOR VALUES FROM ('-infinity') TO ('infinity');

create table data.tickers_prices_actual PARTITION OF data.tickers_prices (check (sys_close is null)) DEFAULT;

-- Так как из партиции сразу значения не удаляются, нам нужно учитывать в качестве параметра sys_close
--  но так как сравнение с null не возможно, приходится в ключе хранить infinity значение, чтоб это сравнение можно было произвести
CREATE UNIQUE INDEX uq_tickers_prices_td_active on data.tickers_prices_actual (ticker, date,  slice_uid, COALESCE(sys_close, 'infinity'::timestamptz)) where sys_close is null;

 `
    };
}
