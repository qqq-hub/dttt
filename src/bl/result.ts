export const STATUS_OK: number = 200;
export const STATUS_CREATED: number = 201;
export const STATUS_ACCEPTED: number = 202;
export const STATUS_NON_AUTHORITATIVE_INFO: number = 203;
export const STATUS_NO_CONTENT: number = 204;

export const STATUS_BAD_REQUEST: number = 400;
export const STATUS_UNAUTHORIZED: number = 401;
export const STATUS_PAYMENT_REQUIRED: number = 402;
export const STATUS_FORBIDDEN: number = 403;
export const STATUS_NOT_FOUND: number = 404;
export const STATUS_CONFLICT: number = 409;

export const STATUS_INTERNAL_SERVER_ERROR: number = 500;

export const makeResult = <T>(
    status: number,
    type: TYPE_RESULT,
    data: T
): Result<T> => {
    return { status, type, data };
};

export const okJson = <T>(data: T): Result<T> => {
    return makeResult(STATUS_OK, "json", data);
};

export const err500 = (msg: string): Result<string> => {
    return makeResult(STATUS_INTERNAL_SERVER_ERROR, "string", msg);
};

export const err400 = <T>(type: TYPE_RESULT, data: T): Result<T> => {
    return makeResult(STATUS_BAD_REQUEST, type, data);
};

export function isError<T>(res: Result<T>): boolean {
    return res.status < 200 || res.status >= 300;
}

export function errConflict(msg: string): Result<string> {
    return makeResult(STATUS_CONFLICT, "string", msg);
}
