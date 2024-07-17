import {
    createRiskFreeRatesGetOnDayFunction,
    createRiskFreeRatesListFunction,
    createRiskFreeRatesUpdateFunction
} from "../functiions/rick_free_rates.mjs";
import { createRiskFreeRatesTable } from "../tables/risk_free_rates.mjs";
import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.2.0",
        queries: [
            createRiskFreeRatesTable,

            //functions risk_free_rates
            createRiskFreeRatesListFunction,
            createRiskFreeRatesGetOnDayFunction,
            createRiskFreeRatesUpdateFunction,
            q(
                `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA data TO ytineres_user;`
            )
        ]
    };
}
