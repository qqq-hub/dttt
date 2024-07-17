import { object, z } from "zod";

export const SchemaUsersRightsListItem = object({
    user_id: z.string({ required_error: "user_id is required" })
});

export const SchemaUsersRightsList = object({
    query: SchemaUsersRightsListItem
});

export const SchemaUsersRightsItem = object({
    user_id: z.string({ required_error: "user_id is required" }),
    right_id: z.string({ required_error: "right_id is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaUsersRightsNew = object({
    body: SchemaUsersRightsItem
});

export const SchemaUsersRightsRemove = object({
    body: SchemaUsersRightsItem
});
