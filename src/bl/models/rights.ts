import { r, WrapDataBaseMethod } from "../db";
import { z } from "zod";

export const db_rights_list = WrapDataBaseMethod(
    "select common.rights_list();",
    z.object({}),
    r<
        {
            id: string;
            name: string;
            description: string;
        }[]
    >()
);
