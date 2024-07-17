import { z } from "zod";
import {
    db_slices_by_ticker_type_list,
    db_tickers_prices_day_list,
    db_tickers_prices_make_slice,
    db_tickers_prices_month_list,
    db_tickers_prices_update,
    db_tickers_prices_without_day_price,
    TickerHistoryRow
} from "../models/tickers_history";
import {
    SchemaSlicesByTickerTypeList,
    SchemaTickersPricesDayList,
    SchemaTickersPricesFetchOneDay,
    SchemaTickersPricesFetchRange,
    SchemaTickersPricesMakeSlice,
    SchemaTickersPricesMonthList,
    SchemaTickersPricesUpdate
} from "../schema/tickers_prices";
import { isError, okJson } from "../result";
import { db_settings_data_get } from "../models/settings_data";
import { SliceRow } from "../models/tickers";

export async function tickersPricesMonthListService(
    app: IApp,
    params: z.infer<typeof SchemaTickersPricesMonthList>
): Promise<Result<{ [key: string]: TickerHistoryRow[] }>> {
    const res = await db_tickers_prices_month_list(app, params.body);
    if (isError(res)) {
        return res as any;
    }
    const result: { [key: string]: TickerHistoryRow[] } = {};
    for (const { ticker } of params.body.tickers) {
        result[ticker] = res.data
            .filter((el) => el.ticker === ticker)
            .map((el) => ({ ...el, date: new Date(el.date) }));
    }
    return okJson(result);
}
export async function tickersPricesDayListService(
    app: IApp,
    params: z.infer<typeof SchemaTickersPricesDayList>
): Promise<Result<{ [key: string]: TickerHistoryRow[] }>> {
    const res = await db_tickers_prices_day_list(app, params.body);
    if (isError(res)) {
        return res as any;
    }
    const result: { [key: string]: TickerHistoryRow[] } = {};
    for (const { ticker } of params.body.tickers) {
        result[ticker] = res.data
            .filter((el) => el.ticker === ticker)
            .map((el) => ({ ...el, date: new Date(el.date) }));
    }
    return okJson(result);
}

export async function tickersPricesUpdateService(
    app: IApp,
    params: z.infer<typeof SchemaTickersPricesUpdate>
): Promise<Result<void>> {
    return await db_tickers_prices_update(app, params.body);
}

export async function tickersPricesFetchRangeService(
    app: IApp,
    params: z.infer<typeof SchemaTickersPricesFetchRange>
): Promise<Result<void>> {
    const prices = await app.finance.getPricesFromRange(
        app,
        params.body.date_from,
        params.body.date_to,
        params.body.tickers
    );
    if (isError(prices)) {
        return prices as any;
    }

    const items: { ticker: string; value: number; date: Date }[] = [];
    for (let { ticker } of params.body.tickers) {
        const priceItems = prices.data[ticker];
        if (priceItems && priceItems.length > 0) {
            items.push(
                ...priceItems.map((el) => ({
                    ticker: ticker,
                    date: el.date,
                    value: el.value
                }))
            );
        }
    }
    return tickersPricesUpdateService(app, {
        body: {
            type: params.body.type,
            data: items,
            user: params.body.user
        }
    });
}

async function getDefaultTickersPrices(
    app: IApp,
    pointDate: Date
): Promise<Result<Map<string, { close: number }>>> {
    const tickersList = await db_settings_data_get(app, {
        type: "default::prices"
    });
    if (isError(tickersList)) {
        return tickersList as any;
    }
    // prettier-ignore
    const tickers = tickersList.data as { ticker: string; after: string; close: number; }[];
    const result = new Map<string, { close: number }>();
    for (const ticker of tickers) {
        if (new Date(ticker.after) <= pointDate) {
            result.set(ticker.ticker, { close: ticker.close });
        }
    }
    return okJson(result);
}

export async function getSlicesByTickerTypeListService(
    app: IApp,
    params: z.infer<typeof SchemaSlicesByTickerTypeList>
): Promise<Result<SliceRow[]>> {
    return await db_slices_by_ticker_type_list(app, {
        ticker: params.query.ticker,
        type: params.query.type
    });
}

export async function tickersPricesMakeSliceService(
    app: IApp,
    params: z.infer<typeof SchemaTickersPricesMakeSlice>
): Promise<Result<void>> {
    return await db_tickers_prices_make_slice(app, params.body);
}

export async function tickersPricesFetchOneDayService(
    app: IApp,
    params: z.infer<typeof SchemaTickersPricesFetchOneDay>
): Promise<Result<void>> {
    let tickers: string[];
    if (params.body.tickers == null) {
        const withoutDayPrice = await db_tickers_prices_without_day_price(
            app,
            params.body
        );
        if (isError(withoutDayPrice)) {
            return withoutDayPrice as any;
        }
        tickers = withoutDayPrice.data.map((el) => el.ticker);
    } else {
        tickers = params.body.tickers.map((el) => el.ticker);
    }
    const defaultPrices = await getDefaultTickersPrices(app, params.body.date);
    if (isError(defaultPrices)) {
        return defaultPrices as any;
    }
    const prices = await app.finance.getDayPrice(
        app,
        tickers.filter((el) => !defaultPrices.data.has(el)),
        params.body.date
    );
    if (isError(prices)) {
        return prices as any;
    }

    const items = prices.data.map((el) => ({
        ticker: el.ticker,
        date: new Date(el.date),
        value: el.close
    }));
    const emptyTickers = tickers.filter((el) => defaultPrices.data.has(el));
    if (emptyTickers.length > 0) {
        // Добавляем дефолтные цены на акции
        items.push(
            ...emptyTickers.map((el) => {
                const close = defaultPrices.data.get(el)!.close;
                return {
                    ticker: el,
                    date: params.body.date,
                    value: close
                };
            })
        );
    }
    return tickersPricesUpdateService(app, {
        body: {
            type: params.body.type,
            data: items,
            user: params.body.user
        }
    });
}
