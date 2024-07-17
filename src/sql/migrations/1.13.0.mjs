import { q } from "../util.mjs";

/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.13.0",
        queries: [
            q(
                `insert into common.rights (id, name, description, sys_open, sys_close, sys_user) values ('moEiFvcMPKXO0iXJqZwCH', 'EstimateChangeOptionsData', 'Возможность изменять параметры опционов', '2024-06-06 14:14:34.921000 +00:00', null, 'Ir3VFwfcfryMlV1bHfR4F');`
            )
        ]
    };
}
