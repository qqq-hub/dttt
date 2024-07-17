import { z } from "zod";
import {
    SchemaIndicesDividendForecastList,
    SchemaIndicesDividendForecastRemove,
    SchemaIndicesDividendForecastUpdate,
    SchemaIndicesDividendForecastUpdateMany
} from "../schema/indices_dividend_forecast";
import {
    db_indices_dividend_forecast_list,
    db_indices_dividend_forecast_remove,
    db_indices_dividend_forecast_update,
    db_indices_dividend_forecast_update_many
} from "../models/indices_dividend_forecast";

export function indicesDividendForecastUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesDividendForecastUpdate>
) {
    return db_indices_dividend_forecast_update(app, params.body);
}

export function indicesDividendForecastUpdateManyService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesDividendForecastUpdateMany>
) {
    return db_indices_dividend_forecast_update_many(app, params.body);
}

export function indicesDividendForecastRemoveService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesDividendForecastRemove>
) {
    return db_indices_dividend_forecast_remove(app, params.body);
}

export function indicesDividendForecastListService(
    app: IApp,
    params: z.infer<typeof SchemaIndicesDividendForecastList>
) {
    return db_indices_dividend_forecast_list(app, params.query);
}
