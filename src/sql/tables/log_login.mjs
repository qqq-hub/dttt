/**
 *
 * @returns {SqlTable}
 */
export function createLogLoginTable() {
    return {
        query: `
            CREATE TABLE common.log_login (
                user_id TEXT NOT NULL,
                ip TEXT NOT NULL,
                event_dt TIMESTAMPTZ NOT NULL
            );
        `
    };
}
