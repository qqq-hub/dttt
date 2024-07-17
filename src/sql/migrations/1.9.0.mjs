import {
    createTickerDividendsUpdateFunc,
    createTickerDividendsLisByTickerFunc,
    createTickerDividendsRemoveFunc
} from "../functiions/ticker_dividends.mjs";
import { createTickerDividendsTable } from "../tables/ticker_dividends.mjs";
import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.9.0",
        queries: [
            createTickerDividendsTable,

            //functions
            createTickerDividendsLisByTickerFunc,
            createTickerDividendsUpdateFunc,
            createTickerDividendsRemoveFunc,
            q(
                `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA data TO ytineres_user;`
            ),
            q(`INSERT INTO common.rights (id, "name", description, sys_open, sys_close, sys_user)
VALUES('FPCuymLfX859LriW7RrN1', 'DividendsManagement', 'Изменение дивидендов акций', now(), NULL, 'Ir3VFwfcfryMlV1bHfR4F');`)
        ]
    };
}
