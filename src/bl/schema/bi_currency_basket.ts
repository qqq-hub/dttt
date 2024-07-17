import { object, z } from "zod";

export const SchemaBiCurrencyBasketLoadItem = object({
    status: z.string({ required_error: "status is required" })
});

export const SchemaBiCurrencyBasketLoad = object({
    query: SchemaBiCurrencyBasketLoadItem
});

export const SchemaBiCurrencyBasketAddItem = object({
    data: z.object({
        name: z.string({ required_error: "name is required" }),
        description: z.string({ required_error: "description is required" }),
        marketId: z.string({ required_error: "marketId is required" })
    }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaBiCurrencyBasketAdd = object({
    body: SchemaBiCurrencyBasketAddItem
});

export const SchemaBiCurrencyBasketUpdateItem = object({
    data: z.object({
        name: z.string({ required_error: "name is required" }),
        description: z.string({ required_error: "description is required" }),
        marketId: z.string({ required_error: "marketId is required" }),
        status: z.string({ required_error: "status is required" })
    }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaBiCurrencyBasketUpdate = object({
    body: SchemaBiCurrencyBasketUpdateItem
});
