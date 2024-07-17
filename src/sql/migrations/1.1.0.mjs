import { createTickerPricesWithoutDayPriceFunc } from "../functiions/tickers_prices.mjs";
import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.1.0",
        queries: [
            q(
                `ALTER TYPE data.settings_type ADD VALUE 'default::prices';`,
                true
            ),

            createTickerPricesWithoutDayPriceFunc
        ]
    };
}
