import { object, z } from "zod";

export const SchemaAuthLoginItem = object({
    email: z.string({ required_error: "email is required" }),
    pass: z.string({ required_error: "pass is required" }),
    client_ip: z.string({ required_error: "client_ip is required" })
});

export const SchemaAuthLogin = object({
    body: SchemaAuthLoginItem
});
