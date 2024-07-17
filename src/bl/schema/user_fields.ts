import { object, z } from "zod";

export const SchemaUserFieldsLoad = object({
    query: object({
        status: z.string({ required_error: "status is required" })
    }),
    body: object({
        group: z.coerce.number({
            required_error: "group is required"
        })
    })
});

export const SchemaUserFieldsItemAdd = object({
    data: z.object({
        id: z.string({ required_error: "id is required" }),
        name: z.string({ required_error: "name is required" }),
        description: z.string(),
        meta: z.any()
    }),
    group: z.coerce.number({
        required_error: "group is required"
    }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaUserFieldsAdd = object({
    body: SchemaUserFieldsItemAdd
});

export const SchemaUserFieldsItemUpdate = object({
    data: z.object({
        id: z.string({ required_error: "id is required" }),
        name: z.string({ required_error: "name is required" }),
        description: z.string(),
        status: z.string({ required_error: "status is required" }),
        meta: z.any()
    }),
    group: z.coerce.number({
        required_error: "group is required"
    }),
    user: z.string({ required_error: "user is required" })
});

export const SchemaUserFieldsUpdate = object({
    body: SchemaUserFieldsItemUpdate
});
