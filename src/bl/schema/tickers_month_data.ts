import { object, z } from "zod";

export const SchemaTickersMonthDataFullUpdateItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    user: z.string({ required_error: "user is required" })
});

export const SchemaTickersMonthDataFullUpdate = object({
    body: SchemaTickersMonthDataFullUpdateItem
});

export const SchemaTickersMonthDataRecalculateBetaItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    tickers: z
        .object({
            ticker: z.string({ required_error: "tickers required" })
        })
        .array()
});

export const SchemaTickersMonthDataRecalculateBeta = object({
    body: SchemaTickersMonthDataRecalculateBetaItem
});

export const SchemaTickersMonthDataRecalculateBestEdpsCurYrItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    tickers: z
        .object({
            ticker: z.string({ required_error: "tickers required" })
        })
        .array()
});

export const SchemaTickersMonthDataRecalculateBestEdpsCurYr = object({
    body: SchemaTickersMonthDataRecalculateBestEdpsCurYrItem
});

export const SchemaTickersMonthDataUpdateItemDataItem = object({
    ticker: z.string({ required_error: "ticker is required" }),
    beta_raw: z.number({ required_error: "beta_raw is required" }),
    best_edps_cur_yr: z.number({
        required_error: "best_edps_cur_yr is required"
    })
});
export const SchemaTickersMonthDataUpdateItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    data: SchemaTickersMonthDataUpdateItemDataItem.array(),
    user: z.string({ required_error: "user is required" })
});

export const SchemaTickersMonthDataUpdate = object({
    body: SchemaTickersMonthDataUpdateItem
});

export const SchemaTickersMonthDataListItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6)
});

export const SchemaTickersMonthDataList = object({
    query: SchemaTickersMonthDataListItem
});
