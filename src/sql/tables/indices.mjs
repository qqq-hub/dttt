/**
 *
 * @returns {SqlTable}
 */
export function createIndicesTable() {
    return {
        query: `
CREATE TABLE data.indices (
                              index TEXT NOT NULL,
                              description TEXT not null ,
                              market TEXT not null ,
                              is_remove BOOLEAN not null ,
                              sys_open TIMESTAMPTZ NOT NULL,
                              sys_close TIMESTAMPTZ,
                              sys_user TEXT not null
);

CREATE UNIQUE INDEX uq_indices_actual
    ON data.indices  (index)
    WHERE sys_close IS NULL;
    `
    };
}
