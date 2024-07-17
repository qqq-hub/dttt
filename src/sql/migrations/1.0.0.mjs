import { createTickersTable } from "../tables/tickers.mjs";
import { createTickersPricesTable } from "../tables/tickers_prices.mjs";
import { createSettingsDataTable } from "../tables/settings_data.mjs";
import { createTickersMonthDataTable } from "../tables/tickers_month_data.mjs";
import { createTickersPricesSlicesTable } from "../tables/tickers_prices_slices.mjs";
import { createTickersTypeEnum } from "../enums/tickers_type.mjs";
import { createIndicesTable } from "../tables/indices.mjs";
import { createIndicesDividendForecastTable } from "../tables/indices_dividend_forecast.mjs";
import { createIndicesPriceReturnTable } from "../tables/indices_price_return.mjs";
import { createMarketsTable } from "../tables/markets.mjs";
import { createCurrenciesTable } from "../tables/currencies.mjs";
import { createExpectedReturnEnum } from "../enums/expected_return_type.mjs";
import { createSettingsTypeEnum } from "../enums/settings_type.mjs";
import { createExpectedReturnTable } from "../tables/expected_return.mjs";
import {
    createTickerListFunc,
    createTickerListWithMarketsFunc,
    createTickerNewFunc,
    createTickerUpdateFunc
} from "../functiions/tickers.mjs";
import {
    createTickerPricesDayListFunc,
    createTickerPricesMakeSliceFunc,
    createTickerPricesMonthListFunc,
    createTickerPricesRemoveFunc,
    createTickerPricesUpdateFunc,
    createTickerPricesWithoutDayPriceFunc
} from "../functiions/tickers_prices.mjs";
import {
    createSettingsDataGetFunc,
    createSettingsDataUpdateFunc
} from "../functiions/settings_data.mjs";
import {
    createCurrenciesListFunc,
    createCurrenciesNewFunc,
    createCurrenciesUpdateFunc
} from "../functiions/currencies.mjs";
import {
    createMarketsListFunc,
    createMarketsNewFunc,
    createMarketsUpdateFunc
} from "../functiions/markets.mjs";
import {
    createIndicesPriceReturnListFunc,
    createIndicesPriceReturnRemoveFunc,
    createIndicesPriceReturnUpdateFunc,
    createIndicesPriceReturnUpdateManyFunc
} from "../functiions/indices_price_return.mjs";
import {
    createIndicesDividendForecastListFunc,
    createIndicesDividendForecastRemoveFunc,
    createIndicesDividendForecastUpdateFunc,
    createIndicesDividendForecastUpdateManyFunc
} from "../functiions/indices_dividend_forecast.mjs";
import {
    createIndicesForErFunc,
    createIndicesListFunc,
    createIndicesNewFunc,
    createIndicesUpdateFunc
} from "../functiions/indices.mjs";
import {
    createExpectedReturnLisByTickerFunc,
    createExpectedReturnListForUpdateFunc,
    createExpectedReturnListFunc,
    createExpectedReturnRemoveFunc,
    createExpectedReturnUpdateFunc
} from "../functiions/expected_return.mjs";
import {
    createTickersMonthDataListForUpdateFunc,
    createTickersMonthDataListFunc,
    createTickersMonthDataRemoveFunc,
    createTickersMonthDataUpdateFunc
} from "../functiions/tickers_month_data.mjs";
import { createNotificationsTable } from "../tables/notifications.mjs";
import { createUsersNotificationTable } from "../tables/users_notifiactions.mjs";
import { createUsersNotificationsCommentsTable } from "../tables/notifiactions_comments.mjs";
import {
    createNotificationsGetFunc,
    createNotificationsListFunc,
    createNotificationsNewFunc,
    createNotificationsReadItFunc
} from "../functiions/notifications.mjs";
import {
    createNotificationsCommentsListFunc,
    createNotificationsCommentsRemoveFunc,
    createNotificationsCommentsSendFunc
} from "../functiions/notifications_comments.mjs";
import { q } from "../util.mjs";

//
/**
 *
 * @returns {SqlMigration}
 */
export function getMigration() {
    return {
        version: "1.0.0",
        queries: [
            q(`CREATE SCHEMA IF NOT EXISTS data;`),
            q(`GRANT ALL PRIVILEGES ON SCHEMA data TO ytineres_user;`),
            createTickersTable,
            createTickersTypeEnum,
            createExpectedReturnEnum,
            createSettingsTypeEnum,
            createTickersPricesTable,
            createSettingsDataTable,
            createTickersMonthDataTable,
            createExpectedReturnTable,
            createTickersPricesSlicesTable,
            createIndicesTable,
            createIndicesDividendForecastTable,
            createIndicesPriceReturnTable,
            createMarketsTable,
            createCurrenciesTable,
            createNotificationsTable,
            createUsersNotificationTable,
            createUsersNotificationsCommentsTable,

            //functions tickers
            createTickerNewFunc,
            createTickerUpdateFunc,
            createTickerListFunc,
            createTickerListWithMarketsFunc,

            //functions tickers prices
            createTickerPricesDayListFunc,
            createTickerPricesUpdateFunc,
            createTickerPricesMonthListFunc,
            createTickerPricesRemoveFunc,
            createTickerPricesMakeSliceFunc,
            createTickerPricesWithoutDayPriceFunc,

            //functions settings_data
            createSettingsDataUpdateFunc,
            createSettingsDataGetFunc,

            // functions tickers_month_data
            createTickersMonthDataUpdateFunc,
            createTickersMonthDataRemoveFunc,
            createTickersMonthDataListForUpdateFunc,
            createTickersMonthDataListFunc,

            //functions expected_return
            createExpectedReturnUpdateFunc,
            createExpectedReturnRemoveFunc,
            createExpectedReturnListForUpdateFunc,
            createExpectedReturnListFunc,
            createExpectedReturnLisByTickerFunc,

            //functions indices
            createIndicesNewFunc,
            createIndicesUpdateFunc,
            createIndicesListFunc,
            createIndicesForErFunc,

            //functions indices_dividend_forecast
            createIndicesDividendForecastUpdateFunc,
            createIndicesDividendForecastUpdateManyFunc,
            createIndicesDividendForecastRemoveFunc,
            createIndicesDividendForecastListFunc,

            //functions indices_price_return
            createIndicesPriceReturnUpdateFunc,
            createIndicesPriceReturnUpdateManyFunc,
            createIndicesPriceReturnRemoveFunc,
            createIndicesPriceReturnListFunc,

            //functions currencies
            createCurrenciesNewFunc,
            createCurrenciesUpdateFunc,
            createCurrenciesListFunc,

            //functions markets
            createMarketsNewFunc,
            createMarketsUpdateFunc,
            createMarketsListFunc,

            //functions notifications
            createNotificationsNewFunc,
            createNotificationsGetFunc,
            createNotificationsListFunc,
            createNotificationsReadItFunc,

            //functions notifications_comments
            createNotificationsCommentsSendFunc,
            createNotificationsCommentsRemoveFunc,
            createNotificationsCommentsListFunc,

            q(
                `select data.settings_data_update('eod::alternative_names_shares', '[]'::jsonb, false, 'Ir3VFwfcfryMlV1bHfR4F');`
            ),

            q(
                `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA data TO ytineres_user;`
            ),
            q(`
select data.markets_new('Россия','RUR','system');
select data.markets_new('Азия','','system');
select data.markets_new('Europe','EUR','system');
select data.markets_new('USA','USD','system');
select data.markets_new('Корея','KRW','system');
select data.markets_new('Гонконг','HKD','system');
select data.markets_new('Великобритания','GBP','system');
select data.markets_new('Континентальный Китай','CNY','system');
select data.markets_new('Бразилия','BRL','system');
select data.markets_new('Япония','','system');
select data.markets_new('Тайвань','TWD','system');`),

            q(`
select data.currencies_new('RUR', 'Рубль', 'system');
select data.currencies_new('USD', 'Доллар', 'system');
select data.currencies_new('EUR', 'Евро', 'system');
select data.currencies_new('GBP', 'Фунт', 'system');
select data.currencies_new('CNY', 'Юань', 'system');
select data.currencies_new('JPY', 'Иена', 'system');
select data.currencies_new('HKD', 'Hong Kong dollar', 'system');
select data.currencies_new('KRW', 'South Korean won', 'system');
select data.currencies_new('CAD', 'Canadian dollar', 'system');
select data.currencies_new('AUD', 'Австралийский доллар', 'system');
select data.currencies_new('BRL', 'Brazilian real', 'system');
select data.currencies_new('TWD', 'New Taiwan dollar', 'system');
            `)
        ]
    };
}
