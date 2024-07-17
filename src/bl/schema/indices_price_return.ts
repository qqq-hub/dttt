import { object, z } from "zod";

export const SchemaIndicesPriceReturnsItem = object({
    index: z.string({
        required_error: "index is required"
    }),
    date: z.coerce.date({
        required_error: "date is required"
    }),
    value: z.number({
        required_error: "value is required"
    })
});
export const SchemaIndicesPriceReturnsUpdateItem =
    SchemaIndicesPriceReturnsItem.extend({
        user: z.string({
            required_error: "user is required"
        })
    });

export const SchemaIndicesPriceReturnsUpdate = object({
    body: SchemaIndicesPriceReturnsUpdateItem
});

export const SchemaIndicesPriceReturnsUpdateManyItem = object({
    data: z.array(SchemaIndicesPriceReturnsItem),
    user: z.string({ required_error: "user is required" })
});
export const SchemaIndicesPriceReturnsUpdateMany = object({
    body: SchemaIndicesPriceReturnsUpdateManyItem
});

export const SchemaIndicesPriceReturnsRemoveItem = object({
    data: z.array(
        SchemaIndicesPriceReturnsItem.pick({ index: true, date: true })
    ),
    user: z.string({ required_error: "user is required" })
});

export const SchemaIndicesPriceReturnsRemove = object({
    body: SchemaIndicesPriceReturnsRemoveItem
});

export const SchemaIndicesPriceReturnsListItem = object({
    index: z.string({ required_error: "index is required" })
});

export const SchemaIndicesPriceReturnsList = object({
    query: SchemaIndicesPriceReturnsListItem
});
