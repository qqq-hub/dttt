import { z } from "zod";
import { r, WrapDataBaseMethod } from "../db";

export const db_log_login_new = WrapDataBaseMethod(
    "select common.log_login_new($user_id, $client_ip);",
    z.object({
        user_id: z.string({ required_error: "user_id is required" }),
        client_ip: z.string({ required_error: "client_ip is required" })
    }),
    r<void>()
);
