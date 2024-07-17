/**
 *
 * @returns {SqlTable}
 */
export function createTickersLocalDataTable() {
    return {
        query: `
CREATE TABLE data.tickers_local_data
(
    uid       uuid PRIMARY KEY NOT NULL,
    ticker    VARCHAR          NOT NULL,
		date			DATE						 NOT NULL,
    data      jsonb            not null,
    sys_open  TIMESTAMPTZ      NOT NULL,
    sys_close TIMESTAMPTZ,
    sys_user  VARCHAR          not null
);


CREATE UNIQUE INDEX uq_tickers_local_data_actual
    ON data.tickers_local_data (ticker, date)
    WHERE sys_close IS NULL;

    `
    };
}
