/**
 *
 * @returns {SqlEnum}
 */
export function createExpectedReturnEnum() {
    return {
        query: `
CREATE TYPE data.expected_return_type AS ENUM (
    '86CoAsZkJ3FWgYeNcn8cf', -- Рыночный
    '6G0UUr8GV4ZlLg_7G71DU',  -- Безрисковый
		'GUCCWYS9VqJWuaFQvJHg8'  -- Динамический
    );
GRANT ALL ON TYPE data.expected_return_type TO ytineres_user;
    
`
    };
}
