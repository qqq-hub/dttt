import {
    createBiCurrencyBasketAddFunc,
    createBiCurrencyBasketLoadFunc,
    createBiCurrencyBasketUpdateFunc
} from "../functiions/bi_currency_basket.mjs";
import {
    createBiCurrencyRateFixingLoadFunc,
    createBiCurrencyRateFixingUploadFunc
} from "../functiions/bi_currency_rate_fixing.mjs";
import { createBiCurrencyBasketTable } from "../tables/bi_currency_basket.mjs";
import { createBiCurrencyRateFixingTable } from "../tables/bi_currency_rate_fixing.mjs";
import { q } from "../util.mjs";
/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.17.0",
        queries: [
            createBiCurrencyBasketTable,
            createBiCurrencyRateFixingTable,

            createBiCurrencyBasketAddFunc,
            createBiCurrencyBasketLoadFunc,
            createBiCurrencyBasketUpdateFunc,

            createBiCurrencyRateFixingLoadFunc,
            createBiCurrencyRateFixingUploadFunc,

            q(
                `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA common TO ytineres_user;`
            )
        ]
    };
}
