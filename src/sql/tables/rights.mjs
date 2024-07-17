/**
 *
 * @returns {SqlTable}
 */
export function createRightsTable() {
    return {
        query: `
            CREATE TABLE common.rights (
                id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                sys_open TIMESTAMPTZ NOT NULL,
                sys_close TIMESTAMPTZ,
                sys_user TEXT NOT NULL
            );
        `
    };
}
