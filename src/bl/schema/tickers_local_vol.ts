import { format } from "date-fns";
import { object, z } from "zod";
import { checkStringDate } from "../../utils/zod";

export const SchemaTickersLocalVolDataGetItem = object({
    uid: z.string({ required_error: "uid is required" })
});

export const SchemaTickersLocalVolDataGet = object({
    query: SchemaTickersLocalVolDataGetItem
});

export const SchemaTickersLocalVolDataListItem = object({
    ticker: z.string({ required_error: "ticker is required" })
});

export const SchemaTickersLocalVolDataList = object({
    query: SchemaTickersLocalVolDataListItem
});

export const SchemaTickersLocalVolCalcListItem = object({
    uid: z.string({ required_error: "uid is required" })
});

export const SchemaTickersLocalVolCalcSaveItem = object({
    uid: z.string({ required_error: "uid is required" }),
    data: z.object({
        items: z.array(z.any()),
        shareOfYear: z.array(z.string()),
        strikes: z.array(z.number())
    }),
    creator: z.string({ required_error: "creator is required" })
});

export const SchemaTickersLocalVolCalcList = object({
    query: SchemaTickersLocalVolCalcListItem
});

export const SchemaTickersLocalVolCalcGetByTickersItem = object({
    tickers: z.string({ required_error: "tickers is required" }).array(),
    dateFrom: checkStringDate({ required_error: "dataFrom is required" }),
    dateTo: checkStringDate({ required_error: "dataTo is required" })
});

export const SchemaTickersLocalVolCalcGetByTickers = object({
    body: SchemaTickersLocalVolCalcGetByTickersItem
});

export const SchemaTickersLocalVolCalcNewItem = object({
    uid: z.string({ required_error: "uid is required" })
});

export const SchemaTickersLocalVolCalcNew = object({
    query: SchemaTickersLocalVolCalcNewItem,
    body: object({
        user: z.string({ required_error: "user is required" })
    })
});

export const SchemaTickersLocalVolDataSaveQueryItem = object({
    date: z.coerce.date({ required_error: "date required" }),
    ticker: z.string({ required_error: "ticker is required" })
});
export const SchemaTickersLocalVolDataSaveItem = object({
    data: object({
        dates: z.array(z.coerce.date()).transform((dates) => {
            return dates.map((d) => format(d, "yyyy-MM-dd"));
        }),
        strikes: z.array(z.number()),
        items: z.array(z.any())
    }),
    isForce: z.boolean().default(false),
    user: z.string({ required_error: "user is required" })
});

export const SchemaTickersLocalVolDataSave = object({
    query: SchemaTickersLocalVolDataSaveQueryItem,
    body: SchemaTickersLocalVolDataSaveItem
});
