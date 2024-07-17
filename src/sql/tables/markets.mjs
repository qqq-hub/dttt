/**
 *
 * @returns {SqlTable}
 */
export function createMarketsTable() {
    return {
        query: `
CREATE TABLE data.markets (
    market TEXT not null ,
    currency TEXT not null , 
    is_remove BOOLEAN not null ,
    sys_open TIMESTAMPTZ not null ,
    sys_close TIMESTAMPTZ,
    sys_user TEXT not null 
);

CREATE UNIQUE INDEX uq_markets_actual ON data.markets (market)
WHERE sys_close IS NULL AND is_remove = false;
`
    };
}
