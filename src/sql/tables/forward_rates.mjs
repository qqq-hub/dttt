/**
 *
 * @returns {SqlTable}
 */
export function createForwardRatesTable() {
    return {
        query: `
            CREATE TABLE data.forward_rates (
                    currency1 TEXT NOT NULL,
                    currency2 TEXT NOT NULL,
                    value FLOAT NOT NULL,
                    start_date DATE NOT NULL,
                    sys_open TIMESTAMPTZ NOT NULL,
                    sys_close TIMESTAMPTZ,
                    sys_user TEXT NOT NULL
            );


            CREATE UNIQUE INDEX uq_risk_forward_rates_actual
                ON data.forward_rates (currency1, currency2, start_date)
                WHERE sys_close IS NULL;
    `
    };
}
