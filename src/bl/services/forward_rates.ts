import { z } from "zod";
import { isError } from "../result";
import {
    SchemaForwardRatesList,
    SchemaForwardRatesUpdate
} from "../schema/forward_rates";
import {
    db_forward_rates_list,
    db_forward_rates_update
} from "../models/forward_rates";

export async function forwardRatesListService(
    app: IApp,
    params: z.infer<typeof SchemaForwardRatesList>
) {
    const res = await db_forward_rates_list(app, params.query);
    if (isError(res)) {
        return res;
    }
    return res;
}

export async function forwardRatesUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaForwardRatesUpdate>
) {
    const res = await db_forward_rates_update(app, params.body);
    if (isError(res)) {
        return res;
    }
    return res;
}
