import { err400, err500, okJson } from "../../bl/result";
import { pool } from "../../utils/connect";

export async function database(
    query: string,
    params: any
): Promise<Result<any>> {
    let client: any;
    try {
        client = await pool.connect();
        const q = parsePgQuery(query, params);
        const data = await client.query({
            text: q.query,
            values: q.params,
            rowMode: "array"
        });
        if (query.toLowerCase().indexOf("call") > -1) {
            return okJson(null);
        }

        return okJson(data.rows[0][0]);
    } catch (e) {
        console.error("database::error", e);
        try {
            if (e.detail && e.detail.indexOf("already exists")) {
                return err400("string", e.detail);
            }
            if (e.message.indexOf("::custom::") > -1) {
                return err400("string", e.message.replace("::custom:: ", ""));
            }
        } catch (e) {}
        return err500("database error");
    } finally {
        client && client.release();
    }
}

export function parsePgQuery(query: string, params: any) {
    const regexParams = /\$(\w+)(?:::\w+)?/g;
    let match: any;
    const paramsNames = [];
    while ((match = regexParams.exec(query)) !== null) {
        // @ts-ignore
        paramsNames.push(match[1]);
    }
    const result = {
        query: query,
        params: new Array(paramsNames.length)
    };
    let i = 1;
    for (let paramsName of paramsNames) {
        result.query = result.query.replace("$" + paramsName, "$" + i);
        result.params[i - 1] = params[paramsName];
        if (result.query.indexOf(`$${i}::jsonb`) > -1) {
            result.params[i - 1] = JSON.stringify(params[paramsName]);
        }
        i++;
    }

    return result;
}
