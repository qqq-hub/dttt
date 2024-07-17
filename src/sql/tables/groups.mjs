/**
 *
 * @returns {SqlTable}
 */
export function createGroupsTable() {
    return {
        query: `
            CREATE TABLE common.groups (
                                         id INTEGER NOT NULL,
                                         name TEXT NOT NULL,
                                         description TEXT NOT NULL,
                                         is_remove BOOLEAN NOT NULL,
                                         sys_open TIMESTAMPTZ NOT NULL,
                                         sys_close TIMESTAMPTZ,
                                         sys_user TEXT NOT null
            );

            CREATE UNIQUE INDEX uq_groups_actual
                ON common.groups (id)
                WHERE sys_close IS NULL ;
        `
    };
}
