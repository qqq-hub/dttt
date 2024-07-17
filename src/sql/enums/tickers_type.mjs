/**
 *
 * @returns {SqlEnum}
 */
export function createTickersTypeEnum() {
    return {
        query: `
CREATE TYPE data.tickers_type AS ENUM (
    '7685225c-af44-4c1a-9829-81273a2580c2' -- Close with splits
);
GRANT ALL ON TYPE data.tickers_type TO ytineres_user;
        `
    };
}
