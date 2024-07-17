import { object, z } from "zod";
import { SchemaUsersPasswordSetItem, SchemaUsersItem } from "./users";

export const SchemaProfilePasswordChangeItem =
    SchemaUsersPasswordSetItem.extend({
        cur_pass: z.string({ required_error: "cur_pass is required" })
    });

export const SchemaProfilePasswordChange = object({
    body: SchemaProfilePasswordChangeItem
});

export const SchemaProfileUpdate = object({
    body: SchemaUsersItem
});
