import { createUsersTable } from "../tables/users.mjs";
import { createGroupsTable } from "../tables/groups.mjs";
import { createRightsTable } from "../tables/rights.mjs";
import { createUsersRightsTable } from "../tables/users_rights.mjs";
import { createLogLoginTable } from "../tables/log_login.mjs";
import {
    createUsersNewFunc,
    createUsersListFunc,
    createUsersGetByEmailFunc,
    createUsersUpdateFunc
} from "../functiions/users.mjs";
import { createRightsListFunc } from "../functiions/rights.mjs";
import {
    createUsersRightsListByIdFunc,
    createUsersRightsNewFunc,
    createUsersRightsRemoveFunc
} from "../functiions/users_rights.mjs";
import { createLogLoginNewFunc } from "../functiions/log_login.mjs";
import {
    createGroupsListFunc,
    createGroupsNewFunc,
    createGroupsUpdateFunc
} from "../functiions/groups.mjs";
import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.8.0",
        queries: [
            createUsersTable,
            createGroupsTable,
            createRightsTable,
            createUsersRightsTable,
            createLogLoginTable,
            //functions
            createUsersNewFunc,
            createUsersListFunc,
            createUsersGetByEmailFunc,
            createUsersUpdateFunc,
            createRightsListFunc,
            createUsersRightsListByIdFunc,
            createUsersRightsNewFunc,
            createUsersRightsRemoveFunc,
            createLogLoginNewFunc,
            createGroupsNewFunc,
            createGroupsListFunc,
            createGroupsUpdateFunc,
            q(
                `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA common TO ytineres_user;`
            )
        ]
    };
}
