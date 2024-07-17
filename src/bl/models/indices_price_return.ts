import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaIndicesPriceReturnsListItem,
    SchemaIndicesPriceReturnsRemoveItem,
    SchemaIndicesPriceReturnsUpdateItem,
    SchemaIndicesPriceReturnsUpdateManyItem
} from "../schema/indices_price_return";

export const db_indices_price_return_update = WrapDataBaseMethod(
    "Select data.indices_price_return_update($index, $date, $value, $user);",
    SchemaIndicesPriceReturnsUpdateItem,
    r<void>()
);
export const db_indices_price_return_update_many = WrapDataBaseMethod(
    "Select data.indices_price_return_update_many($data, $user);",
    SchemaIndicesPriceReturnsUpdateManyItem,
    r<void>()
);

export const db_indices_price_return_remove = WrapDataBaseMethod(
    "select data.indices_price_return_remove($data, $user);",
    SchemaIndicesPriceReturnsRemoveItem,
    r<void>()
);

export const db_indices_price_return_list = WrapDataBaseMethod(
    "select data.indices_price_return_list($index);",
    SchemaIndicesPriceReturnsListItem,
    r<void>()
);
