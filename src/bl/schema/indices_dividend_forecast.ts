import { object, z } from "zod";

export const SchemaIndicesDividendForecastItem = object({
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

export const SchemaIndicesDividendForecastUpdateItem =
    SchemaIndicesDividendForecastItem.extend({
        user: z.string({ required_error: "user is required" })
    });

export const SchemaIndicesDividendForecastUpdate = object({
    body: SchemaIndicesDividendForecastUpdateItem
});

export const SchemaIndicesDividendForecastUpdateManyItem = object({
    data: z.array(SchemaIndicesDividendForecastItem),
    user: z.string({ required_error: "user is required" })
});

export const SchemaIndicesDividendForecastUpdateMany = object({
    body: SchemaIndicesDividendForecastUpdateManyItem
});

export const SchemaIndicesDividendForecastRemoveItem = object({
    data: z.array(
        SchemaIndicesDividendForecastItem.pick({ index: true, date: true })
    ),
    user: z.string({ required_error: "user is required" })
});

export const SchemaIndicesDividendForecastRemove = object({
    body: SchemaIndicesDividendForecastRemoveItem
});

export const SchemaIndicesDividendForecastListItem = object({
    index: z.string({ required_error: "index is required" })
});

export const SchemaIndicesDividendForecastList = object({
    query: SchemaIndicesDividendForecastListItem
});
