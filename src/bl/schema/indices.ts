import { object, z } from "zod";
import { capitalizeLastWord } from "../../utils/string";

export const SchemaIndicesNewItem = object({
    index: z
        .string({ required_error: "index is required" })
        .trim()
        .toUpperCase()
        .transform(capitalizeLastWord),
    description: z.string().optional().default(""),
    market: z.string({ required_error: "market is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaIndicesNew = object({
    body: SchemaIndicesNewItem
});

export const SchemaIndicesUpdateItem = SchemaIndicesNewItem.extend({
    is_remove: z.boolean().optional().default(false)
});

export const SchemaIndicesUpdate = object({
    body: SchemaIndicesUpdateItem
});

export const SchemaIndicesList = object({
    query: object({
        isActive: z
            .enum(["true", "false"], {
                required_error: "isActive is required"
            })
            .transform((val) => val == "true")
    })
});

export const SchemaIndicesForErrItem = object({
    date: z.coerce.date({
        required_error: "date is required"
    })
});

export const SchemaIndicesForErr = object({
    query: SchemaIndicesForErrItem
});
