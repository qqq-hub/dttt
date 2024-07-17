import { createTickerDividendsList } from "../functiions/ticker_dividends.mjs";
import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.10.0",
        queries: [
            //functions
            createTickerDividendsList,

            q(
                `ALTER TYPE data.expected_return_type ADD VALUE 'GUCCWYS9VqJWuaFQvJHg8';`,
                true
            )
        ]
    };
}
