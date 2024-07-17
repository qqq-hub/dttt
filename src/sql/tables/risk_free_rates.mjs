/**
 *
 * @returns {SqlTable}
 */
export function createRiskFreeRatesTable() {
    return {
        query: `
CREATE TABLE data.risk_free_rates (
    currency TEXT NOT NULL,
    term INT NOT NULL,
    rate FLOAT NOT NULL,
    start_date DATE NOT NULL,
    sys_open TIMESTAMPTZ NOT NULL,
    sys_close TIMESTAMPTZ NULL,
    sys_user TEXT NOT NULL
);

CREATE UNIQUE INDEX uq_risk_free_rates_actual
    ON data.risk_free_rates (currency, term, start_date)
    WHERE sys_close IS NULL;    
    `
    };
}
