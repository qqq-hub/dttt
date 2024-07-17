/**
 *
 * @returns {SqlTable}
 */
export function createTickersTable() {
    return {
        query: `
CREATE TABLE data.tickers (
    ticker TEXT not null ,
    stock_index TEXT not null ,
    native_ticker TEXT null ,
    currency TEXT not null ,
    is_remove BOOLEAN not null ,
    sys_open TIMESTAMPTZ not null ,
    sys_close TIMESTAMPTZ NULL,
    sys_user TEXT not null
);
    
CREATE UNIQUE INDEX uq_tickers_active ON data.tickers (
    ticker
) WHERE sys_close IS NULL;
`
    };
}
