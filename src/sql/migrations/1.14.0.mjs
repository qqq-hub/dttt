import {
    createCalendarWeekendLoadFunc,
    createCalendarWeekendLoadManyFunc,
    createCalendarWeekendUploadFunc
} from "../functiions/calendar_weekend.mjs";
import { createCalendarWeekendTable } from "../tables/calendar_weekend.mjs";
import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.14.0",
        queries: [
            createCalendarWeekendTable,

            createCalendarWeekendLoadFunc,
            createCalendarWeekendLoadManyFunc,
            createCalendarWeekendUploadFunc,

            q(
                `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA common TO ytineres_user;`
            )
        ]
    };
}
