/**
 *
 * @returns {SqlTable}
 */
export function createTickersLocalCalcTable() {
    return {
        query: `
CREATE TABLE data.tickers_local_calc
(
    uid_data  uuid						 not null,
    data      jsonb            not null,
    sys_open  TIMESTAMPTZ      NOT NULL,
    sys_close TIMESTAMPTZ,
    sys_user  VARCHAR          not null,
		CONSTRAINT fk_tickers_local_data
        FOREIGN KEY (uid_data) 
        REFERENCES data.tickers_local_data (uid)
);


CREATE UNIQUE INDEX uq_tickers_local_calc_actual
    ON data.tickers_local_calc (uid_data)
    WHERE sys_close IS NULL;
    `
    };
}
