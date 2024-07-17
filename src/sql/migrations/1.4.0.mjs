import { createExpectedReturnListIsDataHasFunc } from "../functiions/expected_return.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.4.0",
        queries: [createExpectedReturnListIsDataHasFunc]
    };
}
