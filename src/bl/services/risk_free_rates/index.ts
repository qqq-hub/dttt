import { z } from "zod";
import { CtrlSaverRates } from "./lib";
import { err400, isError, okJson } from "../../result";
import {
    SchemaRiskFreeRatesAutoUpdate,
    SchemaRiskFreeRatesList,
    SchemaRiskFreeRatesUpdate
} from "../../schema/risk_free_rates";
import {
    db_risk_free_rates_list,
    db_risk_free_rates_update
} from "../../models/risk_free_rates";
import * as usdCtrl from "./lib/usd";
import * as eurCtrl from "./lib/eur";
import * as cnyCtrl from "./lib/cny";
import * as rubCtrl from "./lib/rub";

const USD_TERM_LIST = new Map<string, number>([
    ["1 Mo", 0],
    ["2 Mo", 46],
    ["3 Mo", 76],
    ["6 Mo", 136],
    ["1 Yr", 275],
    ["2 Yr", 549],
    ["3 Yr", 914],
    ["5 Yr", 1461],
    ["7 Yr", 2191]
    // ["10 Yr", 0],
    // ["20 Yr", 0],
    // ["30 Yr", 0],
]);
const RUR_TERM_LIST = new Map<string, number>([
    ["0.25", 0],
    ["0.50", 48],
    ["0.75", 228],
    ["1.00", 319],
    ["2.00", 549],
    ["3.00", 914],
    ["5.00", 1461],
    ["7.00", 2191],
    ["10.00", 3104],
    ["15.00", 4564],
    ["20.00", 6389],
    ["30.00", 9126]
]);

export async function riskFreeRatesAutoUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaRiskFreeRatesAutoUpdate>
): Promise<Result<any>> {
    const usd = await usdCtrl.getRates();
    const eur = await eurCtrl.getRates(usd.items);
    const cny = await cnyCtrl.getRates(usd.items);
    const rub = await rubCtrl.getRates();
    const ctrl = new CtrlSaverRates(app, params.body.user);
    await ctrl.saveRates(usd, "USD", USD_TERM_LIST);
    await ctrl.saveRates(eur, "EUR", USD_TERM_LIST);
    await ctrl.saveRates(rub, "RUR", RUR_TERM_LIST);
    await ctrl.saveRates(cny, "CNY", USD_TERM_LIST);
    return okJson("auto update successful");
}

export async function riskFreeRatesListService(
    app: IApp,
    params: z.infer<typeof SchemaRiskFreeRatesList>
) {
    const res = await db_risk_free_rates_list(app, params.query);
    if (isError(res)) {
        return res;
    }
    return res;
}

export async function riskFreeRatesUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaRiskFreeRatesUpdate>
) {
    const res = await db_risk_free_rates_update(app, params.body);
    if (isError(res)) {
        return res;
    }
    return res;
}
