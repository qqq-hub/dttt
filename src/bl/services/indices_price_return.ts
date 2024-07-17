import { z } from "zod";
import {
    SchemaIndicesPriceReturnsList,
    SchemaIndicesPriceReturnsRemove,
    SchemaIndicesPriceReturnsUpdate,
    SchemaIndicesPriceReturnsUpdateMany
} from "../schema/indices_price_return";
import {
    db_indices_price_return_list,
    db_indices_price_return_remove,
    db_indices_price_return_update,
    db_indices_price_return_update_many
} from "../models/indices_price_return";

export function indicesPriceReturnUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesPriceReturnsUpdate>
) {
    return db_indices_price_return_update(app, params.body);
}

export function indicesPriceReturnUpdateManyService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesPriceReturnsUpdateMany>
) {
    return db_indices_price_return_update_many(app, params.body);
}

export function indicesPriceReturnRemoveService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesPriceReturnsRemove>
) {
    return db_indices_price_return_remove(app, params.body);
}

export function indicesPriceReturnListService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesPriceReturnsList>
) {
    return db_indices_price_return_list(app, params.query);
}
