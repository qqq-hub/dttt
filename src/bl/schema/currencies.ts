import { object, z } from "zod";

export const SchemaCurrenciesNewItem = object({
    short: z.string({
        required_error: "short is required"
    }),
    name: z.string({ required_error: "name is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaCurrenciesNew = object({
    body: SchemaCurrenciesNewItem
});

export const SchemaCurrenciesUpdateItem = SchemaCurrenciesNewItem.extend({
    is_remove: z.boolean().optional().default(false)
});

export const SchemaCurrenciesUpdate = object({
    body: SchemaCurrenciesUpdateItem
});

export const SchemaCurrenciesList = object({
    query: object({
        isActive: z
            .enum(["true", "false"], {
                required_error: "isActive is required"
            })
            .transform((val) => val == "true")
    })
});
