import { z } from "zod";
import { r, WrapDataBaseMethod } from "../db";

export const db_settings_data_get = WrapDataBaseMethod(
    "select data.settings_data_get($type);",
    z.object({ type: z.string() }),
    r<unknown>()
);
