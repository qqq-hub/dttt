import { object, z } from "zod";

export const SchemaMarketsNewItem = object({
    market: z.coerce.date({ required_error: "market is required" }),
    currency: z.string({ required_error: "currency is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaMarketsNew = object({
    body: SchemaMarketsNewItem
});

export const SchemaMarketsUpdateItem = SchemaMarketsNewItem.extend({
    is_remove: z.boolean().optional().default(false)
});

export const SchemaMarketsUpdate = object({
    body: SchemaMarketsUpdateItem
});

export const SchemaMarketsList = object({
    query: object({
        isActive: z
            .enum(["true", "false"], {
                required_error: "isActive is required"
            })
            .transform((val) => val == "true")
    })
});
