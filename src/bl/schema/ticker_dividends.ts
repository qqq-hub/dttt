import { object, z } from "zod";

export const SchemaTickerDividendsListByTickerItem = object({
    ticker: z.string({ required_error: "ticker is required" })
});

export const SchemaTickerDividendsListByTicker = object({
    query: SchemaTickerDividendsListByTickerItem
});

export const SchemaTickerDividendsListItem = object({
    dateFrom: z.coerce.date({ required_error: "dateFrom required" }),
    dateTo: z.coerce.date({ required_error: "dateTo required" }),
    validDate: z.coerce.date({ required_error: "validDate required" }),
    tickers: z.array(
        object({
            ticker: z.string({ required_error: "ticker required" })
        })
    )
});
export const SchemaTickerDividendsList = object({
    body: SchemaTickerDividendsListItem
});

export const SchemaTickerDividendsUpdateItem = object({
    data: z.array(
        object({
            ticker: z.string({ required_error: "ticker required" }),
            value: z.number({ required_error: "value required" }),
            date: z.coerce.date({ required_error: "date required" })
        })
    ),
    user: z.string({ required_error: "user is required" })
});

export const SchemaTickerDividendsUpdate = object({
    body: SchemaTickerDividendsUpdateItem
});

export const SchemaTickerDividendsRemoveItem = object({
    data: z.array(
        object({
            ticker: z.string({ required_error: "ticker required" }),
            date: z.coerce.date({ required_error: "date required" })
        })
    ),
    user: z.string({ required_error: "user is required" })
});

export const SchemaTickerDividendsRemove = object({
    body: SchemaTickerDividendsRemoveItem
});
