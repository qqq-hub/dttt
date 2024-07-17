/**
 *
 * @returns {SqlTable}
 */
export function createIndicesPriceReturnTable() {
    return {
        query: `
CREATE TABLE data.indices_price_return (
                                           index text not null,
                                           date DATE not null,
                                           value FLOAT not null,
                                           sys_open TIMESTAMPTZ NOT NULL,
                                           sys_close TIMESTAMPTZ,
                                           sys_user TEXT not null
);

CREATE UNIQUE INDEX uq_indices_price_return_actual
    ON data.indices_price_return (index, date)
    WHERE sys_close IS NULL;
    `
    };
}
