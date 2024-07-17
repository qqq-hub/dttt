/**
 *
 * @returns {SqlTable}
 */
export function createExpectedReturnTable() {
    return {
        query: `
CREATE TABLE data.expected_return (
                                      ticker TEXT not null,
                                      er FLOAT not null,
                                      type data.expected_return_type not null ,
                                      mmyyyy TEXT CHECK (LENGTH(mmYYYY) = 6) not null,
                                      sys_open TIMESTAMPTZ NOT NULL,
                                      sys_close TIMESTAMPTZ,
                                      sys_user TEXT not null
);

CREATE UNIQUE INDEX uq_expected_return_actual
    ON data.expected_return (ticker, mmyyyy, type)
    WHERE (sys_close IS NULL);
`
    };
}
