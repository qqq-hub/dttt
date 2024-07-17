import { object, z } from "zod";
import { checkStringDate } from "../../utils/zod";

export const SchemaCalendarWeekendLoadItem = object({
    market: z.string({ required_error: "market is required" }),
    year: z.coerce.number({ required_error: "year is required" })
});
export const SchemaCalendarWeekendLoadManyItem = object({
    marketIds: z.string({ required_error: "marketId is required" }).array(),
    years: z.number({ required_error: "year is required" }).array()
});

export const SchemaCalendarWeekendUploadItem = object({
    data: z.array(checkStringDate({ required_error: "data is required" })),
    user: z.string({ required_error: "user is required" })
});

export const SchemaCalendarWeekendUpload = object({
    query: SchemaCalendarWeekendLoadItem,
    body: SchemaCalendarWeekendUploadItem
});

export const SchemaCalendarWeekendLoad = object({
    query: SchemaCalendarWeekendLoadItem
});
export const SchemaCalendarWeekendLoadMany = object({
    body: SchemaCalendarWeekendLoadManyItem
});
