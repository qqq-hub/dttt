import { object, z } from "zod";

export const SchemaRiskFreeRatesAutoUpdateItem = object({
    user: z.string({ required_error: "user is required" })
});
export const SchemaRiskFreeRatesAutoUpdate = object({
    body: SchemaRiskFreeRatesAutoUpdateItem
});

export const SchemaRiskFreeRatesListItem = object({
    currency: z.string({ required_error: "currency is required" }),
    date: z.coerce.date({
        required_error: "date is required"
    })
});

export const SchemaRiskFreeRatesList = object({
    query: SchemaRiskFreeRatesListItem
});

export const SchemaRiskFreeRatesUpdateItem = object({
    currency: z.string({ required_error: "currency is required" }),
    start_date: z.string({
        required_error: "start_date is required"
    }),
    items: z
        .object(
            {
                term: z.number({ required_error: "term is required" }),
                rate: z.number({ required_error: "rate is required" })
            },
            { required_error: "update items is required" }
        )
        .array(),
    user: z.string({ required_error: "user is required" })
});

export const SchemaRiskFreeRatesUpdate = object({
    body: SchemaRiskFreeRatesUpdateItem
});
