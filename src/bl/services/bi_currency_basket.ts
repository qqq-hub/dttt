import { z } from "zod";
import {
    SchemaBiCurrencyBasketLoad,
    SchemaBiCurrencyBasketAdd,
    SchemaBiCurrencyBasketUpdate
} from "../schema/bi_currency_basket";
import {
    db_bi_currency_basket_load,
    db_bi_currency_basket_add,
    db_bi_currency_basket_update
} from "../models/bi_currency_basket";

export function bicurrencybasketLoadService(
    app: IApp,
    params: z.infer<typeof SchemaBiCurrencyBasketLoad>
) {
    return db_bi_currency_basket_load(app, params.query);
}

export function bicurrencybasketAddService(
    app: IApp,
    params: z.infer<typeof SchemaBiCurrencyBasketAdd>
) {
    return db_bi_currency_basket_add(app, params.body);
}

export function bicurrencybasketUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaBiCurrencyBasketUpdate>
) {
    return db_bi_currency_basket_update(app, params.body);
}
