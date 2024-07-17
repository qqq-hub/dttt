import { createErRiskRateAutoUpdate } from "../functiions/expected_return.mjs";

/**
 *
 * @returns {SqlMigration}
 */ export function getMigration() {
    return {
        version: "1.11.0",
        queries: [
            //functions
            createErRiskRateAutoUpdate
        ]
    };
}
