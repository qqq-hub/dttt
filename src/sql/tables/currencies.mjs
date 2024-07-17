/**
 *
 * @returns {SqlTable}
 */
export function createCurrenciesTable() {
    return {
        query: `
CREATE TABLE data.currencies(
                                short TEXT not null,
                                name TEXT NOT NULL,
                                is_remove BOOLEAN not null,
                                sys_open TIMESTAMPTZ NOT NULL,
                                sys_close TIMESTAMPTZ,
                                sys_user TEXT not null
);

CREATE UNIQUE INDEX uq_currencies_actual
    ON data.currencies (short)
    WHERE sys_close IS NULL ;

    `
    };
}
