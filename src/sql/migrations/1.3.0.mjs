import {
    createForwardRatesListFunction,
    createForwardRatesUpdateFunction
} from "../functiions/forward_rates.mjs";
import { createForwardRatesTable } from "../tables/forward_rates.mjs";
import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.3.0",
        queries: [
            createForwardRatesTable,

            //functions forward_rates
            createForwardRatesListFunction,
            createForwardRatesUpdateFunction,
            q(
                `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA data TO ytineres_user;`
            )
        ]
    };
}
