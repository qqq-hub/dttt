/**
 *
 * @returns {SqlTable}
 */
export function createSettingsDataTable() {
    return {
        query: `
CREATE TABLE data.settings_data (
                                    type data.settings_type not null ,
                                    meta JSONB not null ,
                                    is_remove BOOLEAN not null ,
                                    sys_open TIMESTAMPTZ NOT NULL,
                                    sys_close TIMESTAMPTZ,
                                    sys_user TEXT not null
);

CREATE UNIQUE INDEX uq_settings_data_actual
    ON data.settings_data (type)
    WHERE (sys_close IS NULL );
    `
    };
}
