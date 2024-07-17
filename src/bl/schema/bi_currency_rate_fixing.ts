import { object, z } from "zod";
import { checkStringDate } from "../../utils/zod";

export const SchemaBiCurrencyRateFixingRangeItem = object({
    biCurrency: z.string({ required_error: "biCurrency is required" }),
    dFrom: checkStringDate({ required_error: "dFrom is required" }),
    dTo: checkStringDate({ required_error: "dTo is required" })
});

export const SchemaBiCurrencyRateFixingRange = object({
    query: SchemaBiCurrencyRateFixingRangeItem
});
export const SchemaBiCurrencyRateFixingLoadItem = object({
    biCurrency: z.string({ required_error: "biCurrency is required" }),
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6)
});

export const SchemaBiCurrencyRateFixingLoad = object({
    query: SchemaBiCurrencyRateFixingLoadItem
});

export const SchemaBiCurrencyRateFixingUploadItem = object({
    biCurrency: z.string({ required_error: "biCurrency is required" }),
    data: z
        .object({
            date: checkStringDate({ required_error: "date is required" }),
            value: z.coerce.number({
                required_error: "value is required"
            })
        })
        .array()
});

export const SchemaBiCurrencyRateFixingUpload = object({
    body: SchemaBiCurrencyRateFixingUploadItem
});
