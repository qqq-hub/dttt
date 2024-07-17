import { z } from "zod";
import { r, WrapDataBaseMethod } from "../db";
import {
    SchemaCalendarWeekendUploadItem,
    SchemaCalendarWeekendLoadItem,
    SchemaCalendarWeekendLoadManyItem
} from "../schema/calendar_weekend";

export const db_calendar_weekend_load = WrapDataBaseMethod(
    "select common.calendar_weekend_load($market, $year);",
    SchemaCalendarWeekendLoadItem,
    r<any[]>()
);
export const db_calendar_weekend_load_many = WrapDataBaseMethod(
    "select common.calendar_weekend_load_many($data::jsonb);",
    z.object({ data: SchemaCalendarWeekendLoadManyItem }),
    r<any[]>()
);

export const db_calendar_weekend_upload = WrapDataBaseMethod(
    "call common.calendar_weekend_upload($data::jsonb, $market, $year, $user);",
    SchemaCalendarWeekendUploadItem.merge(SchemaCalendarWeekendLoadItem),
    r<void>()
);
