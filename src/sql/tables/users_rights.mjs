/**
 *
 * @returns {SqlTable}
 */
export function createUsersRightsTable() {
    return {
        query: `
            CREATE TABLE common.users_rights (
                user_id TEXT NOT NULL,
                right_id TEXT NOT NULL,
                sys_open TIMESTAMPTZ NOT NULL,
                sys_close TIMESTAMPTZ,
                sys_user TEXT NOT NULL
            );

            CREATE UNIQUE INDEX uq_users_rights_actual
                ON common.users_rights (user_id, right_id)
                WHERE sys_close IS NULL ;
        `
    };
}
