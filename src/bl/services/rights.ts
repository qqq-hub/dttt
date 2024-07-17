import { z } from "zod";
import { SchemaRightsList } from "../schema/rights";
import { db_rights_list } from "../models/rights";
import { okJson } from "../result";

const FILTERED_RIGHTS = new Set(["god's right", "EditUserRights"]);

export async function rightsListService(
    app: IApp,
    params: z.infer<typeof SchemaRightsList>
) {
    let res = await db_rights_list(app, params.query);
    return okJson(res.data.filter((el) => !FILTERED_RIGHTS.has(el.name)));
}
