import { object, z } from "zod";
import { capitalizeLastWord } from "../../utils/string";

export const SchemaTickersList = object({
    query: object({
        isActive: z
            .enum(["true", "false"], {
                required_error: "isActive is required"
            })
            .transform((val) => val == "true")
    })
});

export const SchemaTickerNewDbItem = object({
    ticker: z
        .string({ required_error: "ticker is required" })
        .trim()
        .toUpperCase()
        .transform(capitalizeLastWord),
    stock_index: z
        .string({ required_error: "stock_index is required" })
        .trim()
        .toUpperCase()
        .transform(capitalizeLastWord),
    native_ticker: z.string().optional().nullable().default(null),
    currency: z.string({ required_error: "currency is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaTickerNewItem = SchemaTickerNewDbItem.extend({
    start_date: z.coerce.date({ required_error: "start_date is required" })
});

export const SchemaTickerNew = object({
    body: SchemaTickerNewItem
});

export const SchemaTickerUpdateItem = SchemaTickerNewDbItem.extend({
    is_remove: z.boolean().optional().default(false)
});

export const SchemaTickerUpdate = object({
    body: SchemaTickerUpdateItem
});
