import {
    createUserFieldsAddFunc,
    createUserFieldsUpdateFunc,
    createUserFieldsLoadFunc
} from "../functiions/user_fields.mjs";
import { createUserFieldsTable } from "../tables/user_fields.mjs";
import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.15.0",
        queries: [
            createUserFieldsTable,

            createUserFieldsLoadFunc,
            createUserFieldsUpdateFunc,
            createUserFieldsAddFunc,

            q(
                `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA common TO ytineres_user;`
            )
        ]
    };
}
