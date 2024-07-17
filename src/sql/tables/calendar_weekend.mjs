/**
 *
 * @returns {SqlTable}
 */
export function createCalendarWeekendTable() {
    return {
        query: `
					CREATE TABLE IF NOT EXISTS common.calendar_weekend
						(
								uid        uuid                     not null
										primary key,
								market     text                     not null,
								year       integer                  not null,
								data       jsonb                    not null,
								open_date  timestamp with time zone not null,
								close_date timestamp with time zone,
								creator    text                     not null
						);


            CREATE UNIQUE INDEX uq_calendar_weekend_actual
                ON common.calendar_weekend (market, year)
                WHERE (sys_close IS NULL);
    `
    };
}
