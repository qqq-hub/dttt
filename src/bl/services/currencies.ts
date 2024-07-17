import { z } from "zod";
import { err400, isError } from "../result";
import {
    db_currencies_list,
    db_currencies_update,
    db_currencies_new
} from "../models/currencies";
import {
    SchemaCurrenciesList,
    SchemaCurrenciesNew,
    SchemaCurrenciesUpdate
} from "../schema/currencies";

export function currenciesListService(
    app: IApp,
    params: z.infer<typeof SchemaCurrenciesList>
) {
    return db_currencies_list(app, params.query);
}

export async function currenciesNewService(
    app: IApp,
    params: z.infer<typeof SchemaCurrenciesNew>
) {
    const res = await db_currencies_new(app, params.body);
    if (isError(res)) {
        try {
            // @ts-ignore
            const msg: string = res.data;
            if (msg.indexOf("already exists") > -1) {
                return err400(
                    "string",
                    "Валюта с таким именем уже был заведен ранее"
                );
            }
        } catch (e) {}
    }
    return res;
}

export function currenciesUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaCurrenciesUpdate>
) {
    return db_currencies_update(app, params.body);
}
