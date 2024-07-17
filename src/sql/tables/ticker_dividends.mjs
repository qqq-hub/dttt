/**
 *
 * @returns {SqlTable}
 */
export function createTickerDividendsTable() {
    return {
        query: `
CREATE TABLE data.ticker_dividends (
    ticker TEXT NOT NULL,
    value FLOAT NOT NULL,
    date DATE NOT NULL,
    sys_open TIMESTAMPTZ NOT NULL,
    sys_close TIMESTAMPTZ,
    sys_user TEXT NOT NULL
);

CREATE UNIQUE INDEX uq_ticker_dividends_actual
    ON data.ticker_dividends (ticker, date)
    WHERE (sys_close IS NULL);
`
    };
}
