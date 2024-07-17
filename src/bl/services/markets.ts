import { z } from "zod";
import { err400, isError } from "../result";
import {
    db_markets_list,
    db_markets_update,
    db_markets_new
} from "../models/markets";
import {
    SchemaMarketsList,
    SchemaMarketsNew,
    SchemaMarketsUpdate
} from "../schema/markets";

export function marketsListService(
    app: IApp,
    params: z.infer<typeof SchemaMarketsList>
) {
    return db_markets_list(app, params.query);
}

export async function marketsNewService(
    app: IApp,
    params: z.infer<typeof SchemaMarketsNew>
) {
    const res = await db_markets_new(app, params.body);
    if (isError(res)) {
        try {
            // @ts-ignore
            const msg: string = res.data;
            if (msg.indexOf("already exists") > -1) {
                return err400(
                    "string",
                    "Маркет с таким именем уже был заведен ранее"
                );
            }
        } catch (e) {}
    }
    return res;
}

export function marketsUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaMarketsUpdate>
) {
    return db_markets_update(app, params.body);
}
