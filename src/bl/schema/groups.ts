import { object, z } from "zod";

export const SchemaGroupsList = object({
    query: object({
        isActive: z
            .enum(["true", "false"], {
                required_error: "isActive is required"
            })
            .transform((val) => val == "true")
    })
});

export const SchemaGroupsNewItem = object({
    name: z.string({ required_error: "name is required" }),
    description: z.string({ required_error: "description is required" }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaGroupsNew = object({
    body: SchemaGroupsNewItem
});

export const SchemaGroupsUpdateItem = SchemaGroupsNewItem.extend({
    id: z.number({ required_error: "id is required" }),
    is_remove: z.boolean({ required_error: "is_remove is required" })
});

export const SchemaGroupsUpdate = object({
    body: SchemaGroupsUpdateItem
});
