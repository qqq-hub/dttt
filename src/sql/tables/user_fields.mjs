/**
 *
 * @returns {SqlTable}
 */
export function createUserFieldsTable() {
    return {
        query: `
	CREATE TABLE IF NOT EXISTS  common.user_fields
	(
			id          text                     not null
					primary key,
			name        text                     not null,
			description text                     not null,
			meta        jsonb                    not null,
			open_date   timestamp with time zone not null,
			close_date  timestamp with time zone,
			creator     text                     not null,
			"group"     integer                  not null
	);

	CREATE UNIQUE INDEX common_user_fields_name_group_index
			on common.user_fields (name, "group");

    `
    };
}
