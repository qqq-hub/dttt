import {
    createSlicesByTickerTypeListFunc,
    createTickerPricesMakeSliceFunc
} from "../functiions/tickers_prices.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.5.0",
        queries: [
            createSlicesByTickerTypeListFunc,
            createTickerPricesMakeSliceFunc
        ]
    };
}
