/**
 *
 * @returns {SqlTable}
 */
export function createUsersTable() {
    return {
        query: `
            CREATE TABLE common.users (
                id TEXT NOT NULL,
                email TEXT NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                middle_name TEXT NOT NULL,
                salt TEXT NOT NULL,
                hash TEXT NOT NULL,
                group_id INTEGER NOT NULL,
                is_remove BOOLEAN NOT NULL,
                sys_open TIMESTAMPTZ NOT NULL,
                sys_close TIMESTAMPTZ,
                sys_user TEXT NOT NULL
            );

            CREATE UNIQUE INDEX uq_users_actual
                ON common.users (id)
                WHERE sys_close IS NULL ;
			
            CREATE UNIQUE INDEX uq_users_actual_by_email
                ON common.users (email)
                WHERE sys_close IS NULL ;
        `
    };
}
