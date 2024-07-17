/**
 *
 * @returns {SqlTable}
 */
export function createIndicesDividendForecastTable() {
    return {
        query: `
CREATE TABLE data.indices_dividend_forecast (
                                                index text not null,
                                                date DATE not null,
                                                value FLOAT not null,
                                                sys_open TIMESTAMPTZ NOT NULL,
                                                sys_close TIMESTAMPTZ,
                                                sys_user TEXT not null
);

CREATE UNIQUE INDEX uq_indices_dividend_forecast_actual
    ON data.indices_dividend_forecast (index, date)
    WHERE sys_close IS NULL;    
    `
    };
}
