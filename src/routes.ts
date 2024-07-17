import { Express, Request, Response } from "express";
import {
    tickerNewService,
    tickersListService,
    tickerUpdateService
} from "./bl/services/tickers";
import validateResource from "./middleware/validateResource";
import {
    SchemaTickerNew,
    SchemaTickersList,
    SchemaTickerUpdate
} from "./bl/schema/tickers";
import { STATUS_CREATED, isError } from "./bl/result";
import { application } from "./application/application";
import {
    SchemaSlicesByTickerTypeList,
    SchemaTickersPricesDayList,
    SchemaTickersPricesFetchOneDay,
    SchemaTickersPricesFetchRange,
    SchemaTickersPricesMakeSlice,
    SchemaTickersPricesMonthList,
    SchemaTickersPricesUpdate
} from "./bl/schema/tickers_prices";
import {
    tickersPricesDayListService,
    tickersPricesFetchOneDayService,
    tickersPricesFetchRangeService,
    tickersPricesMonthListService,
    tickersPricesUpdateService,
    getSlicesByTickerTypeListService,
    tickersPricesMakeSliceService
} from "./bl/services/tickers_prices";
import {
    SchemaCurrenciesList,
    SchemaCurrenciesNew
} from "./bl/schema/currencies";
import {
    currenciesListService,
    currenciesNewService
} from "./bl/services/currencies";
import { SchemaMarketsList } from "./bl/schema/markets";
import { marketsListService } from "./bl/services/markets";
import {
    SchemaIndicesPriceReturnsList,
    SchemaIndicesPriceReturnsRemove,
    SchemaIndicesPriceReturnsUpdate,
    SchemaIndicesPriceReturnsUpdateMany
} from "./bl/schema/indices_price_return";
import {
    indicesPriceReturnListService,
    indicesPriceReturnRemoveService,
    indicesPriceReturnUpdateManyService,
    indicesPriceReturnUpdateService
} from "./bl/services/indices_price_return";
import {
    SchemaIndicesDividendForecastList,
    SchemaIndicesDividendForecastRemove,
    SchemaIndicesDividendForecastUpdate,
    SchemaIndicesDividendForecastUpdateMany
} from "./bl/schema/indices_dividend_forecast";
import {
    indicesDividendForecastListService,
    indicesDividendForecastRemoveService,
    indicesDividendForecastUpdateManyService,
    indicesDividendForecastUpdateService
} from "./bl/services/indices_dividend_forecast";
import {
    SchemaIndicesList,
    SchemaIndicesNew,
    SchemaIndicesUpdate
} from "./bl/schema/indices";
import {
    indicesListService,
    indicesNewService,
    indicesUpdateService
} from "./bl/services/indices";
import {
    SchemaExpectedReturnFullUpdate,
    SchemaExpectedReturnList,
    SchemaExpectedReturnListByTicker,
    SchemaExpectedReturnRecalculate,
    SchemaExpectedReturnUpdateRiskFree,
    SchemaExpectedReturnUpdateRiskFreeByTickers
} from "./bl/schema/expected_return";
import {
    expectedReturnFullUpdateService,
    expectedReturnListByTickerService,
    expectedReturnListService,
    expectedReturnRecalculateService,
    expectedReturnUpdateRiskFreeByTickersService,
    expectedReturnUpdateRiskFreeService
} from "./bl/services/expected_return";
import {
    notificationsGetService,
    notificationsListService,
    notificationsNewService,
    notificationsReadItService
} from "./bl/services/notifications";
import {
    SchemaNotificationsGet,
    SchemaNotificationsList,
    SchemaNotificationsNew,
    SchemaNotificationsReadIt
} from "./bl/schema/notifications";
import {
    SchemaNotificationsCommentList,
    SchemaNotificationsCommentRemove,
    SchemaNotificationsCommentSend
} from "./bl/schema/notifications_comments";
import {
    notificationsCommentListService,
    notificationsCommentRemoveService,
    notificationsCommentsSendService
} from "./bl/services/notifications_comments";
import {
    SchemaRiskFreeRatesAutoUpdate,
    SchemaRiskFreeRatesList,
    SchemaRiskFreeRatesUpdate
} from "./bl/schema/risk_free_rates";
import {
    riskFreeRatesAutoUpdateService,
    riskFreeRatesListService,
    riskFreeRatesUpdateService
} from "./bl/services/risk_free_rates";
import {
    SchemaForwardRatesList,
    SchemaForwardRatesUpdate
} from "./bl/schema/forward_rates";
import {
    forwardRatesListService,
    forwardRatesUpdateService
} from "./bl/services/forward_rates";
import { SchemaAuthLogin } from "./bl/schema/auth";
import { authLoginService } from "./bl/services/auth";
import {
    SchemaUsersList,
    SchemaUsersNewApi,
    SchemaUsersPasswordSet,
    SchemaUsersUpdateApi
} from "./bl/schema/users";
import {
    usersListService,
    usersNewService,
    usersPasswordSetService,
    usersUpdateService
} from "./bl/services/users";
import { SchemaRightsList } from "./bl/schema/rights";
import { rightsListService } from "./bl/services/rights";
import {
    SchemaUsersRightsList,
    SchemaUsersRightsNew,
    SchemaUsersRightsRemove
} from "./bl/schema/users_rights";
import {
    usersRightsListService,
    usersRightsNewService,
    usersRightsRemoveService
} from "./bl/services/users_rights";
import {
    SchemaGroupsList,
    SchemaGroupsNew,
    SchemaGroupsUpdate
} from "./bl/schema/groups";
import {
    groupsListService,
    groupsNewService,
    groupsUpdateService
} from "./bl/services/groups";
import {
    profilePasswordChangeService,
    profileUpdateService
} from "./bl/services/profile";
import {
    SchemaProfilePasswordChange,
    SchemaProfileUpdate
} from "./bl/schema/profile";
import {
    tickerDividendsListByTickerService,
    tickerDividendsListService,
    tickerDividendsRemoveService,
    tickerDividendsUpdateService
} from "./bl/services/ticker_dividends";
import {
    SchemaTickerDividendsList,
    SchemaTickerDividendsListByTicker,
    SchemaTickerDividendsRemove,
    SchemaTickerDividendsUpdate
} from "./bl/schema/ticker_dividends";
import {
    SchemaTickersLocalVolDataGet,
    SchemaTickersLocalVolDataList,
    SchemaTickersLocalVolDataSave,
    SchemaTickersLocalVolCalcList,
    SchemaTickersLocalVolCalcNew,
    SchemaTickersLocalVolCalcGetByTickers
} from "./bl/schema/tickers_local_vol";
import {
    tickersLocalVolDataListService,
    tickersLocalVolDataSaveService,
    tickersLocalVolDataGetService,
    tickersLocalVolCalcListService,
    tickersLocalVolResultNewService,
    tickersLocalVolCalcGetByTickersService
} from "./bl/services/tickers_local_vol";
import {
    SchemaCalendarWeekendLoad,
    SchemaCalendarWeekendLoadMany,
    SchemaCalendarWeekendUpload
} from "./bl/schema/calendar_weekend";
import {
    calendarWeekendLoadManyService,
    calendarWeekendLoadService,
    calendarWeekendUploadService
} from "./bl/services/calendar_weekend";
import {
    SchemaUserFieldsAdd,
    SchemaUserFieldsLoad,
    SchemaUserFieldsUpdate
} from "./bl/schema/user_fields";
import {
    userFieldsAddService,
    userFieldsLoadService,
    userFieldsUpdateService
} from "./bl/services/user_fields";

import {
    SchemaBiCurrencyBasketLoad,
    SchemaBiCurrencyBasketAdd,
    SchemaBiCurrencyBasketUpdate
} from "./bl/schema/bi_currency_basket";
import {
    bicurrencybasketLoadService,
    bicurrencybasketAddService,
    bicurrencybasketUpdateService
} from "./bl/services/bi_currency_basket";

import {
    SchemaBiCurrencyRateFixingLoad,
    SchemaBiCurrencyRateFixingRange,
    SchemaBiCurrencyRateFixingUpload
} from "./bl/schema/bi_currency_rate_fixing";
import {
    bicurrencyratefixingLoadService,
    bicurrencyratefixingUploadService
} from "./bl/services/bi_currency_rate_fixing";

const app: IApp = application;

function parseType(t: TYPE_RESULT): string {
    if (t === "json") {
        return "application/json";
    } else if (t === "string") {
        return "text/plain";
    }
    throw "unknown type of result";
}

function returnToClient(res: Response, result: Result<any>) {
    if (result.status == STATUS_CREATED) {
        res.location(result.data);
        return res.status(201).end();
    }
    res.status(result.status).type(parseType(result.type));
    if (result.type === "json") {
        return res.json(result.data);
    } else if (result.type === "string") {
        return res.send(result.data);
    }
    throw "unknown type of result to client";
}

function defaultHandler(
    serviceFunction: (app: IApp, params: any) => Promise<Result<any>>,
    opt?: {
        isResInclude: boolean; // Данный параметр используется, когда нужно вернуть ответ самостоятельно в другом месте. Например код 202
    }
) {
    return async (req: Request, res: Response) => {
        if (opt?.isResInclude) {
            // @ts-ignore
            req.app_params.res = res;
        }
        // @ts-ignore
        const result = await serviceFunction(app, req.app_params);
        if (isError(result)) {
            return returnToClient(res, result);
        }
        if (opt?.isResInclude && result.data === null) {
            return;
        }
        return returnToClient(res, result);
    };
}

function _tickers_routes(app: Express) {
    const path = "/api/v1/data/tickers";
    app.post(
        path + "/new",
        validateResource(SchemaTickerNew, { isUserRequire: true }),
        defaultHandler(tickerNewService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaTickerUpdate, { isUserRequire: true }),
        defaultHandler(tickerUpdateService)
    );
    app.get(
        path + "/list",
        validateResource(SchemaTickersList),
        defaultHandler(tickersListService)
    );
}

function _tickers_prices_routes(app: Express) {
    const path = "/api/v1/data/tickers_prices";
    app.post(
        path + "/month_list",
        validateResource(SchemaTickersPricesMonthList),
        defaultHandler(tickersPricesMonthListService)
    );
    app.post(
        path + "/day_list",
        validateResource(SchemaTickersPricesDayList),
        defaultHandler(tickersPricesDayListService)
    );
    app.post(
        path + "/fetch_range",
        validateResource(SchemaTickersPricesFetchRange, {
            isUserRequire: true
        }),
        defaultHandler(tickersPricesFetchRangeService)
    );
    app.post(
        path + "/fetch_one_day",
        validateResource(SchemaTickersPricesFetchOneDay, {
            isUserRequire: true
        }),
        defaultHandler(tickersPricesFetchOneDayService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaTickersPricesUpdate, {
            isUserRequire: true
        }),
        defaultHandler(tickersPricesUpdateService)
    );
    app.get(
        path + "/slice_by_ticker",
        validateResource(SchemaSlicesByTickerTypeList),
        defaultHandler(getSlicesByTickerTypeListService)
    );
    app.post(
        path + "/make_slice",
        validateResource(SchemaTickersPricesMakeSlice, {
            isUserRequire: true
        }),
        defaultHandler(tickersPricesMakeSliceService)
    );
}

function _tickers_month_data_routes(app: Express) {
    const path = "/api/v1/data/tickers_month_data";
    // app.get(
    //     path + "/get",
    //     validateResource(SchemaTickersPricesMonthList),
    //     defaultHandler(tickersPricesMonthListService)
    // );
}

function _expected_return_routes(app: Express) {
    const path = "/api/v1/data/expected_return";
    app.post(
        path + "/full_update",
        validateResource(SchemaExpectedReturnFullUpdate, {
            isUserRequire: true
        }),
        defaultHandler(expectedReturnFullUpdateService, { isResInclude: true })
    );
    app.post(
        path + "/recalculate",
        validateResource(SchemaExpectedReturnRecalculate, {
            isUserRequire: true
        }),
        defaultHandler(expectedReturnRecalculateService, { isResInclude: true })
    );
    app.post(
        path + "/list",
        validateResource(SchemaExpectedReturnList),
        defaultHandler(expectedReturnListService)
    );
    app.get(
        path + "/list_by_ticker",
        validateResource(SchemaExpectedReturnListByTicker),
        defaultHandler(expectedReturnListByTickerService)
    );
    app.post(
        path + "/save_risk_free",
        validateResource(SchemaExpectedReturnUpdateRiskFree, {
            isUserRequire: true
        }),
        defaultHandler(expectedReturnUpdateRiskFreeService)
    );
    app.post(
        path + "/save_risk_free_by_tickers",
        validateResource(SchemaExpectedReturnUpdateRiskFreeByTickers, {
            isUserRequire: true
        }),
        defaultHandler(expectedReturnUpdateRiskFreeByTickersService)
    );
}

function _indices_rotes(app: Express) {
    const path = "/api/v1/data/indices";
    app.post(
        path + "/new",
        validateResource(SchemaIndicesNew, { isUserRequire: true }),
        defaultHandler(indicesNewService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaIndicesUpdate, { isUserRequire: true }),
        defaultHandler(indicesUpdateService)
    );

    app.get(
        path + "/list",
        validateResource(SchemaIndicesList),
        defaultHandler(indicesListService)
    );
}

function _indices_dividend_forecast_routes(app: Express) {
    const path = "/api/v1/data/indices_dividend_forecast";
    app.post(
        path + "/update",
        validateResource(SchemaIndicesDividendForecastUpdate, {
            isUserRequire: true
        }),
        defaultHandler(indicesDividendForecastUpdateService)
    );
    app.post(
        path + "/update_many",
        validateResource(SchemaIndicesDividendForecastUpdateMany, {
            isUserRequire: true
        }),
        defaultHandler(indicesDividendForecastUpdateManyService)
    );

    app.delete(
        path + "/remove",
        validateResource(SchemaIndicesDividendForecastRemove, {
            isUserRequire: true
        }),
        defaultHandler(indicesDividendForecastRemoveService)
    );
    app.get(
        path + "/list",
        validateResource(SchemaIndicesDividendForecastList),
        defaultHandler(indicesDividendForecastListService)
    );
}

function _indices_price_return_routes(app: Express) {
    const path = "/api/v1/data/indices_price_return";
    app.post(
        path + "/update",
        validateResource(SchemaIndicesPriceReturnsUpdate, {
            isUserRequire: true
        }),
        defaultHandler(indicesPriceReturnUpdateService)
    );
    app.post(
        path + "/update_many",
        validateResource(SchemaIndicesPriceReturnsUpdateMany, {
            isUserRequire: true
        }),
        defaultHandler(indicesPriceReturnUpdateManyService)
    );

    app.delete(
        path + "/remove",
        validateResource(SchemaIndicesPriceReturnsRemove, {
            isUserRequire: true
        }),
        defaultHandler(indicesPriceReturnRemoveService)
    );
    app.get(
        path + "/list",
        validateResource(SchemaIndicesPriceReturnsList),
        defaultHandler(indicesPriceReturnListService)
    );
}

function _markets_routes(app: Express) {
    const path = "/api/v1/data/markets";
    // app.post(
    //     path + "/new",
    //     validateResource(SchemaMarketsNew, { isUserRequire: true }),
    //     defaultHandler(marketsNewService)
    // );
    // app.post(
    //     path + "/update",
    //     validateResource(SchemaMarketsUpdate, { isUserRequire: true }),
    //     defaultHandler(marketsUpdateService)
    // );

    app.get(
        path + "/list",
        validateResource(SchemaMarketsList),
        defaultHandler(marketsListService)
    );
}

function _currencies_routes(app: Express) {
    const path = "/api/v1/data/currencies";
    app.post(
        path + "/new",
        validateResource(SchemaCurrenciesNew, { isUserRequire: true }),
        defaultHandler(currenciesNewService)
    );
    // app.post(
    //     path + "/update",
    //     validateResource(SchemaCurrenciesUpdate),
    //     defaultHandler(currenciesUpdateService)
    // );

    app.get(
        path + "/list",
        validateResource(SchemaCurrenciesList),
        defaultHandler(currenciesListService)
    );
}

function _notifications_routes(app: Express) {
    const path = "/api/v1/data/notifications";
    app.post(
        path + "/new",
        validateResource(SchemaNotificationsNew),
        defaultHandler(notificationsNewService)
    );
    app.get(
        path + "/get",
        validateResource(SchemaNotificationsGet),
        defaultHandler(notificationsGetService)
    );
    app.post(
        path + "/list",
        validateResource(SchemaNotificationsList, { isUserRequire: true }),
        defaultHandler(notificationsListService)
    );
    app.post(
        path + "/read_it",
        validateResource(SchemaNotificationsReadIt, { isUserRequire: true }),
        defaultHandler(notificationsReadItService)
    );
}
function _notifications_comments_routes(app: Express) {
    const path = "/api/v1/data/notifications/comments";
    app.post(
        path + "/send",
        validateResource(SchemaNotificationsCommentSend, {
            isUserRequire: true
        }),
        defaultHandler(notificationsCommentsSendService)
    );
    app.get(
        path + "/list",
        validateResource(SchemaNotificationsCommentList),
        defaultHandler(notificationsCommentListService)
    );
    app.post(
        path + "/remove",
        validateResource(SchemaNotificationsCommentRemove, {
            isUserRequire: true
        }),
        defaultHandler(notificationsCommentRemoveService)
    );
}

function _risk_free_rates_routes(app: Express) {
    const path = "/api/v1/data/risk_free_rates";
    app.get(
        path + "/list",
        validateResource(SchemaRiskFreeRatesList),
        defaultHandler(riskFreeRatesListService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaRiskFreeRatesUpdate, { isUserRequire: true }),
        defaultHandler(riskFreeRatesUpdateService)
    );
    app.post(
        path + "/fetch_auto_update",
        validateResource(SchemaRiskFreeRatesAutoUpdate, {
            isUserRequire: true
        }),
        defaultHandler(riskFreeRatesAutoUpdateService)
    );
}

function _forward_rates_routes(app: Express) {
    const path = "/api/v1/data/forward_rates";
    app.get(
        path + "/list",
        validateResource(SchemaForwardRatesList),
        defaultHandler(forwardRatesListService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaForwardRatesUpdate, { isUserRequire: true }),
        defaultHandler(forwardRatesUpdateService)
    );
}

function _auth(app: Express) {
    const path = "/api/v1/data/auth";
    app.post(
        path + "/login",
        validateResource(SchemaAuthLogin),
        defaultHandler(authLoginService)
    );
}

function _users(app: Express) {
    const path = "/api/v1/data/users";
    app.post(
        path + "/new",
        validateResource(SchemaUsersNewApi, { isUserRequire: true }),
        defaultHandler(usersNewService)
    );
    app.get(
        path + "/list",
        validateResource(SchemaUsersList),
        defaultHandler(usersListService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaUsersUpdateApi, { isUserRequire: true }),
        defaultHandler(usersUpdateService)
    );
    app.post(
        path + "/password_set",
        validateResource(SchemaUsersPasswordSet, { isUserRequire: true }),
        defaultHandler(usersPasswordSetService)
    );
}

function _profile(app: Express) {
    const path = "/api/v1/data/profile";
    app.post(
        path + "/password_change",
        validateResource(SchemaProfilePasswordChange, { isUserRequire: true }),
        defaultHandler(profilePasswordChangeService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaProfileUpdate, { isUserRequire: true }),
        defaultHandler(profileUpdateService)
    );
}

function _rights(app: Express) {
    const path = "/api/v1/data/rights";
    app.get(
        path + "/list",
        validateResource(SchemaRightsList),
        defaultHandler(rightsListService)
    );
}

function _users_rights(app: Express) {
    const path = "/api/v1/data/users_rights";
    app.get(
        path + "/list",
        validateResource(SchemaUsersRightsList),
        defaultHandler(usersRightsListService)
    );
    app.post(
        path + "/new",
        validateResource(SchemaUsersRightsNew, { isUserRequire: true }),
        defaultHandler(usersRightsNewService)
    );
    app.post(
        path + "/remove",
        validateResource(SchemaUsersRightsRemove, { isUserRequire: true }),
        defaultHandler(usersRightsRemoveService)
    );
}

function _groups(app: Express) {
    const path = "/api/v1/data/groups";
    app.get(
        path + "/list",
        validateResource(SchemaGroupsList),
        defaultHandler(groupsListService)
    );
    app.post(
        path + "/new",
        validateResource(SchemaGroupsNew, { isUserRequire: true }),
        defaultHandler(groupsNewService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaGroupsUpdate, { isUserRequire: true }),
        defaultHandler(groupsUpdateService)
    );
}

function _ticker_dividends_routes(app: Express) {
    const path = "/api/v1/data/ticker_dividends";
    app.get(
        path + "/list_by_ticker",
        validateResource(SchemaTickerDividendsListByTicker),
        defaultHandler(tickerDividendsListByTickerService)
    );
    app.post(
        path + "/list",
        validateResource(SchemaTickerDividendsList),
        defaultHandler(tickerDividendsListService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaTickerDividendsUpdate, { isUserRequire: true }),
        defaultHandler(tickerDividendsUpdateService)
    );
    app.post(
        path + "/remove",
        validateResource(SchemaTickerDividendsRemove, { isUserRequire: true }),
        defaultHandler(tickerDividendsRemoveService)
    );
}

function _ticker_local_vol_routes(app: Express) {
    const path = "/api/v1/data/tickers_local_vol";
    const pathData = path + "/data";
    const pathCalc = path + "/calc";
    app.get(
        pathData + "/list",
        validateResource(SchemaTickersLocalVolDataList),
        defaultHandler(tickersLocalVolDataListService)
    );
    app.get(
        pathData + "/get",
        validateResource(SchemaTickersLocalVolDataGet),
        defaultHandler(tickersLocalVolDataGetService)
    );
    app.post(
        pathData + "/save",
        validateResource(SchemaTickersLocalVolDataSave, {
            isUserRequire: true
        }),
        defaultHandler(tickersLocalVolDataSaveService)
    );

    app.get(
        pathCalc + "/get",
        validateResource(SchemaTickersLocalVolCalcList),
        defaultHandler(tickersLocalVolCalcListService)
    );
    app.post(
        pathCalc + "/getByTickers",
        validateResource(SchemaTickersLocalVolCalcGetByTickers),
        defaultHandler(tickersLocalVolCalcGetByTickersService)
    );
    app.post(
        pathCalc + "/new",
        validateResource(SchemaTickersLocalVolCalcNew, {
            isUserRequire: true
        }),
        defaultHandler(tickersLocalVolResultNewService)
    );
}

function _calendar_weekend_routes(app: Express) {
    const path = "/api/v1/data/calendar_weekend";
    app.get(
        path + "/load",
        validateResource(SchemaCalendarWeekendLoad),
        defaultHandler(calendarWeekendLoadService)
    );
    app.post(
        path + "/load_many",
        validateResource(SchemaCalendarWeekendLoadMany),
        defaultHandler(calendarWeekendLoadManyService)
    );
    app.post(
        path + "/upload",
        validateResource(SchemaCalendarWeekendUpload, { isUserRequire: true }),
        defaultHandler(calendarWeekendUploadService)
    );
}

function _user_fields_routes(app: Express) {
    const path = "/api/v1/data/user_fields";
    app.post(
        path + "/add",
        validateResource(SchemaUserFieldsAdd, {
            isUserRequire: true,
            isGroupRequire: true
        }),
        defaultHandler(userFieldsAddService)
    );
    app.post(
        path + "/update",
        validateResource(SchemaUserFieldsUpdate, {
            isUserRequire: true,
            isGroupRequire: true
        }),
        defaultHandler(userFieldsUpdateService)
    );
    app.get(
        path + "/load",
        validateResource(SchemaUserFieldsLoad, { isGroupRequire: true }),
        defaultHandler(userFieldsLoadService)
    );
}

function _bi_currency_basket_routes(app: Express) {
    const path = "/api/v1/data/bi_currency_basket";

    app.get(
        path + "/load",
        validateResource(SchemaBiCurrencyBasketLoad),
        defaultHandler(bicurrencybasketLoadService)
    );

    app.post(
        path + "/add",
        validateResource(SchemaBiCurrencyBasketAdd, { isUserRequire: true }),
        defaultHandler(bicurrencybasketAddService)
    );

    app.post(
        path + "/update",
        validateResource(SchemaBiCurrencyBasketUpdate, { isUserRequire: true }),
        defaultHandler(bicurrencybasketUpdateService)
    );
}

function _bi_currency_rate_fixing_routes(app: Express) {
    const path = "/api/v1/data/bi_currency_rate_fixing";

    app.get(
        path + "/range",
        validateResource(SchemaBiCurrencyRateFixingRange),
        defaultHandler(bicurrencyratefixingLoadService)
    );

    app.get(
        path + "/load",
        validateResource(SchemaBiCurrencyRateFixingLoad),
        defaultHandler(bicurrencyratefixingLoadService)
    );

    app.post(
        path + "/upload",
        validateResource(SchemaBiCurrencyRateFixingUpload),
        defaultHandler(bicurrencyratefixingUploadService)
    );
}
function routes(app: Express) {
    _tickers_routes(app);
    _tickers_prices_routes(app);
    _tickers_month_data_routes(app);
    _expected_return_routes(app);
    _indices_rotes(app);
    _indices_dividend_forecast_routes(app);
    _indices_price_return_routes(app);
    _markets_routes(app);
    _currencies_routes(app);
    _notifications_routes(app);
    _notifications_comments_routes(app);
    _risk_free_rates_routes(app);
    _forward_rates_routes(app);
    _auth(app);
    _users(app);
    _rights(app);
    _users_rights(app);
    _groups(app);
    _profile(app);
    _ticker_dividends_routes(app);
    _ticker_local_vol_routes(app);
    _calendar_weekend_routes(app);
    _user_fields_routes(app);
    _bi_currency_basket_routes(app);
    _bi_currency_rate_fixing_routes(app);
}

export default routes;
