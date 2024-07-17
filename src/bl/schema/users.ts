import { object, z } from "zod";

export const SchemaUsersItem = object({
    email: z.string({ required_error: "email is required" }),
    first_name: z.string({ required_error: "first_name is required" }),
    last_name: z.string({ required_error: "last_name is required" }),
    middle_name: z.string({ required_error: "middle_name is required" }),
    group_id: z.number({ required_error: "group_id is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaUsersNewItemApi = SchemaUsersItem.extend({
    password: z.string({ required_error: "password is required" }),
    confirm_password: z.string({
        required_error: "confirm_password is required"
    })
});

export const SchemaUsersNewApi = object({
    body: SchemaUsersNewItemApi
});

export const SchemaUsersNewItemDb = SchemaUsersItem.extend({
    id: z.string({ required_error: "id is required" }),
    salt: z.string({ required_error: "salt is required" }),
    hash: z.string({ required_error: "hash is required" })
});

export const SchemaUsersListItem = object({
    isActive: z
        .enum(["true", "false"], {
            required_error: "isActive is required"
        })
        .transform((val) => val == "true"),
    group_id: z.coerce.number().optional()
});

export const SchemaUsersList = object({
    query: SchemaUsersListItem
});

export const SchemaUsersUpdateItemDb = SchemaUsersItem.extend({
    id: z.string({ required_error: "id is required" }),
    salt: z.string({ required_error: "salt is required" }),
    hash: z.string({ required_error: "hash is required" }),
    is_remove: z.boolean().default(false)
});

export const SchemaUsersUpdateItemApi = SchemaUsersItem.extend({
    id: z.string({ required_error: "id is required" }),
    is_remove: z.boolean().default(false)
});

export const SchemaUsersUpdateApi = object({
    body: SchemaUsersUpdateItemApi
});

export const SchemaUsersPasswordSetItem = object({
    email: z.string({ required_error: "email is required" }),
    new_pass: z.string({ required_error: "new_pass is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaUsersPasswordSet = object({
    body: SchemaUsersPasswordSetItem
});
