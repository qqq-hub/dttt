import { z } from "zod";
import { isError } from "../result";
import {
    db_calendar_weekend_load,
    db_calendar_weekend_load_many,
    db_calendar_weekend_upload
} from "../models/calendar_weekend";
import {
    SchemaCalendarWeekendLoad,
    SchemaCalendarWeekendLoadMany,
    SchemaCalendarWeekendUpload
} from "../schema/calendar_weekend";

export async function calendarWeekendLoadService(
    app: IApp,
    params: z.infer<typeof SchemaCalendarWeekendLoad>
) {
    const res = await db_calendar_weekend_load(app, params.query);
    if (isError(res)) {
        return res;
    }
    return res;
}
export async function calendarWeekendLoadManyService(
    app: IApp,
    params: z.infer<typeof SchemaCalendarWeekendLoadMany>
) {
    const res = await db_calendar_weekend_load_many(app, { data: params.body });
    if (isError(res)) {
        return res;
    }
    return res;
}

export async function calendarWeekendUploadService(
    app: IApp,
    params: z.infer<typeof SchemaCalendarWeekendUpload>
) {
    const res = await db_calendar_weekend_upload(app, {
        ...params.body,
        ...params.query
    });
    if (isError(res)) {
        return res;
    }
    return res;
}
