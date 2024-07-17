/**
 *
 * @returns {SqlTable}
 */
export function createTickersPricesSlicesTable() {
    return {
        query: `
CREATE TABLE data.tickers_prices_slices (
    uid UUID PRIMARY KEY,
    ticker TEXT not null,
    comment TEXT not null ,
    type data.tickers_type not null ,
    valid_from date not null ,
    valid_to date not null ,
    sys_open TIMESTAMPTZ not null ,
    sys_close TIMESTAMPTZ,
    sys_user TEXT not null 
);

CREATE UNIQUE INDEX uq_tickers_prices_slices_active on data.tickers_prices_slices (ticker, type  ) where sys_close is null and valid_to='infinity';
`
    };
}
