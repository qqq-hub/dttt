import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaBiCurrencyBasketLoadItem,
    SchemaBiCurrencyBasketAddItem,
    SchemaBiCurrencyBasketUpdateItem
} from "../schema/bi_currency_basket";

export const db_bi_currency_basket_load = WrapDataBaseMethod(
    "select common.bi_currency_basket_load($status);",
    SchemaBiCurrencyBasketLoadItem,
    r<any[]>()
);

export const db_bi_currency_basket_add = WrapDataBaseMethod(
    "call common.bi_currency_basket_add($data,$user);",
    SchemaBiCurrencyBasketAddItem,
    r<any[]>()
);

export const db_bi_currency_basket_update = WrapDataBaseMethod(
    "call common.bi_currency_basket_update($data,$user);",
    SchemaBiCurrencyBasketUpdateItem,
    r<any[]>()
);
