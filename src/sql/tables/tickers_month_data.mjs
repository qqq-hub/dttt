/**
 *
 * @returns {SqlTable}
 */
export function createTickersMonthDataTable() {
    return {
        query: `
CREATE TABLE data.tickers_month_data (
                                         ticker text not null,
                                         mmYYYY VARCHAR(6) CHECK (LENGTH(mmYYYY) = 6) not null ,
                                         beta_raw FLOAT not null,
                                         best_edps_cur_yr FLOAT not null,
                                         sys_open TIMESTAMPTZ NOT null,
                                         sys_close TIMESTAMPTZ,
                                         sys_user TEXT not null
) PARTITION BY RANGE (sys_close);


CREATE TABLE data.tickers_month_data_history PARTITION OF data.tickers_month_data
    FOR VALUES FROM ('-infinity') TO ('infinity');

create table data.tickers_month_data_actual PARTITION OF data.tickers_month_data (check (sys_close is null)) DEFAULT;

CREATE UNIQUE INDEX uq_tickers_month_data_tMY_active
    on data.tickers_month_data_actual (ticker, mmYYYY, COALESCE(sys_close, 'infinity'::timestamptz)) where sys_close is null;`
    };
}
