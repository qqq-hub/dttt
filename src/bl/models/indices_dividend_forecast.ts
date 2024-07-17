import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaIndicesDividendForecastListItem,
    SchemaIndicesDividendForecastRemoveItem,
    SchemaIndicesDividendForecastUpdateItem,
    SchemaIndicesDividendForecastUpdateManyItem
} from "../schema/indices_dividend_forecast";

export const db_indices_dividend_forecast_update = WrapDataBaseMethod(
    "select data.indices_dividend_forecast_update($index, $date, $value, $user);",
    SchemaIndicesDividendForecastUpdateItem,
    r<void>()
);
export const db_indices_dividend_forecast_update_many = WrapDataBaseMethod(
    "select data.indices_dividend_forecast_update_many($data, $user);",
    SchemaIndicesDividendForecastUpdateManyItem,
    r<void>()
);

export const db_indices_dividend_forecast_remove = WrapDataBaseMethod(
    "select data.indices_dividend_forecast_remove($data, $user);",
    SchemaIndicesDividendForecastRemoveItem,
    r<void>()
);

export const db_indices_dividend_forecast_list = WrapDataBaseMethod(
    "select data.indices_dividend_forecast_list($index);",
    SchemaIndicesDividendForecastListItem,
    r<void>()
);
