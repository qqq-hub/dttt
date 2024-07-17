/**
 *
 * @returns {SqlFunction}
 */
export function createLogLoginNewFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.log_login_new(p_user_id TEXT, p_client_ip TEXT)
RETURNS VOID AS
$$
BEGIN
    INSERT INTO common.log_login (user_id, ip, event_dt)
    VALUES (p_user_id, p_client_ip, now());
END;
$$
LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.log_login_new TO ytineres_user;
`
    };
}
