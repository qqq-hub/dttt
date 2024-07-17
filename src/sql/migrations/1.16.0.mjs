import { createTickersLocalVolCalcGetByTickersFunc } from "../functiions/tickers_local_vol_calc.mjs";
/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.16.0",
        queries: [createTickersLocalVolCalcGetByTickersFunc]
    };
}
