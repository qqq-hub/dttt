import { z } from "zod";
import { addDays, addMonths, format, parse } from "date-fns";
import {
    SchemaBiCurrencyRateFixingLoad,
    SchemaBiCurrencyRateFixingRange,
    SchemaBiCurrencyRateFixingUpload
} from "../schema/bi_currency_rate_fixing";
import {
    db_bi_currency_rate_fixing_load,
    db_bi_currency_rate_fixing_upload
} from "../models/bi_currency_rate_fixing";

export function bicurrencyratefixingLoadService(
    app: IApp,
    params: z.infer<typeof SchemaBiCurrencyRateFixingLoad>
) {
    const dFrom = parse(params.query.mmYYYY, "MMyyyy", new Date());
    const dTo = addDays(addMonths(dFrom, 1), -1);

    return db_bi_currency_rate_fixing_load(app, {
        biCurrency: params.query.biCurrency,
        dFrom: format(dFrom, "yyyy-MM-dd"),
        dTo: format(dTo, "yyyy-MM-dd")
    });
}

export function bicurrencyratefixingRangeService(
    app: IApp,
    params: z.infer<typeof SchemaBiCurrencyRateFixingRange>
) {
    return db_bi_currency_rate_fixing_load(app, params.query);
}

export function bicurrencyratefixingUploadService(
    app: IApp,
    params: z.infer<typeof SchemaBiCurrencyRateFixingUpload>
) {
    return db_bi_currency_rate_fixing_upload(app, params.body);
}
