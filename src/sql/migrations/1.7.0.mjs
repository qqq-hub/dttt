import {
    createNotificationsListFunc,
    createNotificationsReadItFunc
} from "../functiions/notifications.mjs";
import { createNotificationsCommentsSendFunc } from "../functiions/notifications_comments.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.7.0",
        queries: [
            createNotificationsListFunc,
            createNotificationsReadItFunc,
            createNotificationsCommentsSendFunc
        ]
    };
}
