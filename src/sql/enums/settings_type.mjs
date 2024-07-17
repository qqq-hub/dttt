/**
 *
 * @returns {SqlEnum}
 */
export function createSettingsTypeEnum() {
    return {
        query: `
CREATE TYPE data.settings_type AS ENUM (
    '27255374-13fb-4eae-9279-cfd5f7382f7a', -- Update close with splits data
    'eod::alternative_names_shares', -- альтернативные названия для сервиса eod 
    'default::prices' -- не получаем данные по этим акциям, а берем дефолтное значение
    );
    GRANT ALL ON TYPE data.settings_type TO ytineres_user;
`
    };
}
