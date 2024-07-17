import {
    createTickersLocalVolDataGetFunc,
    createTickersLocalVolDataListFunc,
    createTickersLocalVolDataSaveFunc
} from "../functiions/tickers_local_vol_data.mjs";
import {
    createTickersLocalVolCalcGetFunc,
    createTickersLocalVolCalcGetPreCalcDataFunc,
    createTickersLocalVolCalcSaveFunc
} from "../functiions/tickers_local_vol_calc.mjs";
import { createTickersLocalDataTable } from "../tables/tickers_local_vol_data.mjs";
import { createTickersLocalCalcTable } from "../tables/tickers_local_vol_calc.mjs";
import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.12.0",
        queries: [
            createTickersLocalDataTable,
            createTickersLocalCalcTable,

            createTickersLocalVolDataSaveFunc,
            createTickersLocalVolDataGetFunc,
            createTickersLocalVolDataListFunc,

            createTickersLocalVolCalcSaveFunc,
            createTickersLocalVolCalcGetFunc,
            createTickersLocalVolCalcGetPreCalcDataFunc,

            q(
                `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA data TO ytineres_user;`
            ),
            q(
                `insert into common.rights (id, name, description, sys_open, sys_close, sys_user) values ('Av4vkBVoXC7lE6FQal2Bt', 'LocalVolatilityEdit', 'Редактирование и расчет локальной волотильности', '2024-05-21 19:12:34.921000 +00:00', null, 'Ir3VFwfcfryMlV1bHfR4F');`
            )
        ]
    };
}
