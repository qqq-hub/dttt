import { z } from "zod";
import { err400, isError, okJson } from "../result";
import {
    db_indices_list,
    db_indices_update,
    db_indices_new,
    db_indices_for_er,
    IndicesForErResultItem
} from "../models/indices";
import {
    SchemaIndicesForErr,
    SchemaIndicesList,
    SchemaIndicesNew,
    SchemaIndicesUpdate
} from "../schema/indices";
import { tickerNewService } from "./tickers";
import { db_markets_list } from "../models/markets";

export function indicesListService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesList>
) {
    return db_indices_list(app, params.query);
}

export async function indicesNewService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesNew>
) {
    const markets_list = await db_markets_list(app, { isActive: true });
    if (isError(markets_list)) {
        return markets_list as any;
    }
    const currency = markets_list.data.find(
        (el) => el.market == params.body.market
    )?.currency;
    if (!currency) {
        return err400("string", "неизвестный маркет");
    }
    const res = await db_indices_new(app, params.body);
    if (isError(res)) {
        try {
            // @ts-ignore
            const msg: string = res.data;
            if (msg.indexOf("already exists") > -1) {
                return err400(
                    "string",
                    "Индекс с таким именем уже был заведен ранее"
                );
            }
        } catch (e) {}
        return res;
    }
    tickerNewService(app, {
        body: {
            ticker: params.body.index,
            currency: currency,
            stock_index: params.body.index,
            native_ticker: null,
            start_date: new Date("2010-01-01"),
            user: params.body.user
        }
    });
    return res;
}

export function indicesUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesUpdate>
) {
    return db_indices_update(app, params.body);
}

export async function indicesForErService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesForErr>
): Promise<Result<{ [key: string]: IndicesForErResultItem }>> {
    const res = await db_indices_for_er(app, params.query);
    if (isError(res)) {
        return res as any;
    }
    const result: { [key: string]: IndicesForErResultItem } = {};
    for (const index of res.data) {
        result[index.index] = index;
    }
    return okJson(result);
}
