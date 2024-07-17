import { object, z } from "zod";

export const SchemaForwardRatesListItem = object({
    date: z.coerce.date({
        required_error: "date is required"
    })
});

export const SchemaForwardRatesList = object({
    query: SchemaForwardRatesListItem
});

export const SchemaForwardRatesUpdateItem = object({
    start_date: z.string({
        required_error: "start_date is required"
    }),
    items: z
        .object(
            {
                currency1: z.string({
                    required_error: "currency1 is required"
                }),
                currency2: z.string({
                    required_error: "currency2 is required"
                }),
                value: z.number({ required_error: "value is required" })
            },
            { required_error: "update items is required" }
        )
        .array(),
    user: z.string({ required_error: "user is required" })
});

export const SchemaForwardRatesUpdate = object({
    body: SchemaForwardRatesUpdateItem
});
