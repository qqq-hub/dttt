import { z, ZodRawShape } from "zod";
import {
    isError,
    makeResult,
    okJson,
    STATUS_BAD_REQUEST,
    STATUS_INTERNAL_SERVER_ERROR
} from "./result";

// Оборачиваю в не нужную функцию, для автоматического получения типа
// Когда примут это изменение в этом не будет необходимости
// https://github.com/microsoft/TypeScript/issues/10571

export function r<T>(): { o: T } {
    // @ts-ignore
    return;
}

export function WrapDataBaseMethod<T extends ZodRawShape, Out>(
    query: string,
    schema: z.ZodObject<T>,
    _: { o: Out | null }
) {
    type paramsType = z.infer<typeof schema>;
    return async (app: IApp, params: paramsType): Promise<Result<Out>> => {
        const parseResult = schema.safeParse(params);
        if (!parseResult.success) {
            return makeResult<any>(
                STATUS_BAD_REQUEST,
                "string",
                "not valid argument"
            );
        }
        let res = await app.database(query, params);
        if (isError(res)) {
            return res;
        }
        if (res.type == "json") {
            return okJson(res.data);
        }
        return makeResult<any>(
            STATUS_INTERNAL_SERVER_ERROR,
            "string",
            "unknown return data"
        );
    };
}
