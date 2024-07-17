import {
    createTickerPricesDayListFunc,
    createTickerPricesMonthListFunc,
    createTickerPricesRemoveFunc
} from "../functiions/tickers_prices.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.6.0",
        queries: [
            createTickerPricesDayListFunc,
            createTickerPricesMonthListFunc,
            createTickerPricesRemoveFunc
        ]
    };
}
