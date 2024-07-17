import { object, z } from "zod";
import { Response } from "express";

export const SchemaExpectedReturnListItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    type: z.string({ required_error: "type is required" }),
    tickers: z
        .object({
            ticker: z.string({ required_error: "tickers is required" })
        })
        .array()
});

export const SchemaExpectedReturnListByTickerItem = object({
    ticker: z.string({ required_error: "ticker is required" }),
    type: z.string({ required_error: "type is required" })
});

export const SchemaExpectedReturnList = object({
    body: SchemaExpectedReturnListItem
});

export const SchemaExpectedReturnListByTicker = object({
    query: SchemaExpectedReturnListByTickerItem
});

export const SchemaExpectedReturnFullUpdateItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    type: z.string({ required_error: "type is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaExpectedReturnFullUpdate = object({
    body: SchemaExpectedReturnFullUpdateItem,
    res: z.any() as z.ZodType<Response, any>
});

export const SchemaExpectedReturnRecalculateItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    type: z.string({ required_error: "type is required" }),
    tickers: z
        .object({
            ticker: z.string({ required_error: "tickers required" })
        })
        .array(),
    user: z.string({ required_error: "user is required" })
});

export const SchemaExpectedReturnRecalculate = object({
    body: SchemaExpectedReturnRecalculateItem,
    res: z.any() as z.ZodType<Response, any>
});

export const SchemaExpectedReturnUpdateItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    type: z.string({ required_error: "type is required" }),
    data: z
        .object({
            ticker: z.string({ required_error: "tickers required" }),
            er: z.number({ required_error: "er required" })
        })
        .array(),
    user: z.string({ required_error: "user is required" })
});

export const SchemaExpectedReturnUpdate = object({
    body: SchemaExpectedReturnUpdateItem
});

export const SchemaExpectedReturnRiskRateAutoUpdate = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    data: z
        .object({
            ticker: z.string({ required_error: "tickers required" })
        })
        .array(),
    user: z.string({ required_error: "user is required" })
});

//
export const SchemaExpectedReturnListIsDataHasItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    type: z.string({ required_error: "type is required" }),
    items: z
        .object({
            index: z.string({ required_error: "index required" }),
            value: z.number({ required_error: "value required" })
        })
        .array()
});

export const SchemaExpectedReturnUpdateRiskFreeItem =
    SchemaExpectedReturnListIsDataHasItem.extend({
        isForce: z.boolean({ required_error: "isForce is required" }),
        user: z.string({ required_error: "user is required" })
    });

export const SchemaExpectedReturnUpdateRiskFree = object({
    body: SchemaExpectedReturnUpdateRiskFreeItem
});

export const SchemaExpectedReturnUpdateRiskFreeByTickersItem = object({
    mmYYYY: z.string({ required_error: "mmYYYY is required" }).max(6).min(6),
    tickers: z
        .object({
            ticker: z.string({ required_error: "ticker required" }),
            value: z.number({ required_error: "value required" })
        })
        .array(),
    user: z.string({ required_error: "user is required" })
});

export const SchemaExpectedReturnUpdateRiskFreeByTickers = object({
    body: SchemaExpectedReturnUpdateRiskFreeByTickersItem
});
