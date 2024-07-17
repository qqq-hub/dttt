import { object, z } from "zod";

export const SchemaTickersPricesMonthListItem = object({
    type: z.enum(["7685225c-af44-4c1a-9829-81273a2580c2"], {
        required_error: "type is required"
    }),
    valid_date: z.coerce.date({ required_error: "valid_date is required" }),
    date_from: z.coerce.date({ required_error: "date_from is required" }),
    date_to: z.coerce.date({ required_error: "date_to is required" }),
    tickers: z
        .object(
            { ticker: z.string() },
            { required_error: "tickers is required" }
        )
        .array()
});

export const SchemaTickersPricesMonthList = object({
    body: SchemaTickersPricesMonthListItem
});

export const SchemaTickersPricesDayListItem = object({
    type: z.enum(["7685225c-af44-4c1a-9829-81273a2580c2"], {
        required_error: "type is required"
    }),
    valid_date: z.coerce.date({ required_error: "valid_date is required" }),
    date_from: z.coerce.date({ required_error: "date_from is required" }),
    date_to: z.coerce.date({ required_error: "date_to is required" }),
    tickers: z
        .object(
            { ticker: z.string() },
            { required_error: "tickers is required" }
        )
        .array()
});

export const SchemaTickersPricesDayList = object({
    body: SchemaTickersPricesDayListItem
});

export const SchemaTickersPricesUpdateItem = object({
    type: z.enum(["7685225c-af44-4c1a-9829-81273a2580c2"], {
        required_error: "type is required"
    }),
    data: z
        .object(
            {
                ticker: z.string({ required_error: "ticker is required" }),
                date: z.coerce.date({ required_error: "date is required" }),
                value: z.number({ required_error: "value is required" })
            },
            { required_error: "tickers is required" }
        )
        .array(),
    user: z.string({ required_error: "user is required" })
});

export const SchemaTickersPricesUpdate = object({
    body: SchemaTickersPricesUpdateItem
});

export const SchemaTickersPricesFetchRangeItem = object({
    type: z.enum(["7685225c-af44-4c1a-9829-81273a2580c2"], {
        required_error: "type is required"
    }),
    date_from: z
        .string({ required_error: "date_from is required" })
        .pipe(z.coerce.date()),
    date_to: z
        .string({ required_error: "date_to is required" })
        .pipe(z.coerce.date()),
    tickers: z
        .object(
            { ticker: z.string() },
            { required_error: "tickers is required" }
        )
        .array(),
    user: z.string({ required_error: "user is required" })
});

export const SchemaTickersPricesFetchRange = object({
    body: SchemaTickersPricesFetchRangeItem
});

export const SchemaTickersPricesWithoutDayPriceItem = object({
    type: z.enum(["7685225c-af44-4c1a-9829-81273a2580c2"], {
        required_error: "type is required"
    }),
    date: z.coerce.date({ required_error: "date is required" })
});

export const SchemaTickersPricesMakeSliceItem = object({
    type: z.enum(["7685225c-af44-4c1a-9829-81273a2580c2"], {
        required_error: "type is required"
    }),
    ticker: z.string({ required_error: "ticker is required" }),
    comment: z.string({ required_error: "comment is required" }),
    date: z.coerce.date({ required_error: "date is required" }),
    user: z.string({ required_error: "user is required" })
});
export const SchemaTickersPricesMakeSlice = object({
    body: SchemaTickersPricesMakeSliceItem
});

export const SchemaSlicesByTickerTypeListItem = object({
    type: z.enum(["7685225c-af44-4c1a-9829-81273a2580c2"], {
        required_error: "type is required"
    }),
    ticker: z.string({ required_error: "ticker is required" })
});

export const SchemaSlicesByTickerTypeList = object({
    query: SchemaSlicesByTickerTypeListItem
});

export const SchemaTickersPricesWithoutDayPrice = object({
    body: SchemaTickersPricesWithoutDayPriceItem
});

export const SchemaTickersPricesFetchOneDayItem =
    SchemaTickersPricesWithoutDayPriceItem.extend({
        tickers: z
            .object({ ticker: z.string() })
            .array()
            .optional()
            .nullable()
            .default(null),
        user: z.string({ required_error: "user is required" })
    });

export const SchemaTickersPricesFetchOneDay = object({
    body: SchemaTickersPricesFetchOneDayItem
});
