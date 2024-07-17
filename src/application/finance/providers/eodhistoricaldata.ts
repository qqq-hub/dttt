import {
    err400,
    err500,
    isError,
    makeResult,
    okJson,
    STATUS_OK
} from "../../../bl/result";
import { db_settings_data_get } from "../../../bl/models/settings_data";
import { format } from "date-fns";
import { db_notifications_new } from "../../../bl/models/notifications";
import { KURILENKO_ID, SERGEEV_ID } from "../../../utils/users";

const HOST = "https://eodhistoricaldata.com/";
const TYPE_SETTINGS = "eod::alternative_names_shares";

const periodMultiplier = new Map<string, number>([
    ["Monthly", 12],
    ["Quarterly", 4],
    ["Semiannually", 2]
]);

async function getAlternativeName(app: IApp): Promise<
    Result<{
        bloombergToAlter: Map<string, string>;
        alterToBloomberg: Map<string, string>;
    }>
> {
    const res = await db_settings_data_get(app, { type: TYPE_SETTINGS });
    if (isError(res)) {
        return res as any;
    }
    const items = res.data as { bloomberg: string; alter: string }[];
    const bloombergToAlter = new Map<string, string>();
    const alterToBloomberg = new Map<string, string>();

    for (let item of items) {
        bloombergToAlter.set(item.bloomberg, item.alter);
        alterToBloomberg.set(item.alter, item.bloomberg);
    }
    return okJson({
        bloombergToAlter,
        alterToBloomberg
    });
}

export async function getDiv(
    app: IApp,
    tickers: string[],
    year: number
): Promise<Result<Map<string, number>>> {
    const alterNames = await getAlternativeName(app);
    if (isError(alterNames)) {
        return alterNames as any;
    }
    const result = new Map<string, number>();
    for (let ticker of tickers) {
        const res = await _getDiv(alterNames.data, ticker, year);
        if (!isError(res)) {
            result.set(ticker, res.data);
        }
    }
    return okJson(result);
}

export async function _getDiv(
    alterNames: {
        bloombergToAlter: Map<string, string>;
        alterToBloomberg: Map<string, string>;
    },
    ticker: string,
    year: number
): Promise<Result<number>> {
    const tickerAlt = alterNames.bloombergToAlter.get(ticker.toUpperCase());
    if (!tickerAlt) {
        return err400(
            "string",
            "alternative name for " + ticker + " no found"
        ) as any;
    }
    // prettier-ignore
    let url = `${HOST}api/div/${tickerAlt}?from=${year}-01-01&$to=${year + 1}-01-01&fmt=json&api_token=${process.env.EOD_API_KEY}`;
    try {
        const body = await fetch(url);
        const rows: { value: number; period: string }[] = await body.json();
        if (rows.length > 0) {
            const period = rows[0].period;
            let m = periodMultiplier.get(period) || 1;
            return makeResult(STATUS_OK, "number", rows[0].value * m);
        }
        return makeResult(STATUS_OK, "number", 0);
    } catch (e) {
        return err500(e) as any;
    }
}

export async function getPricesFromRange(
    app: IApp,
    dFrom: Date,
    dTo: Date,
    tickers: { ticker: string }[]
): Promise<
    Result<{
        [key: string]: { date: Date; value: number }[];
    }>
> {
    const result: { [key: string]: { date: Date; value: number }[] } = {};
    for (let { ticker } of tickers) {
        const prices = await getHistoryAdjSplits(app, ticker, dFrom, dTo);
        if (isError(prices)) {
            db_notifications_new(app, {
                kind: "Eodhistoricaldata::PricesFromRange",
                description:
                    "Проблема получения цен за диапзон времени для тикера " +
                    ticker,
                meta: prices.data,
                users: [KURILENKO_ID, SERGEEV_ID]
            });
            continue;
            // return prices as any;
        }
        result[ticker] = prices.data.map((el) => ({
            value: el.close,
            date: new Date(el.date)
        }));
    }
    return okJson(result);
}

export async function getHistoryAdjSplits(
    app: IApp,
    ticker: string,
    dateFrom: Date,
    dateTo: Date
): Promise<Result<{ close: number; date: string }[]>> {
    const alterNames = await getAlternativeName(app);
    if (isError(alterNames)) {
        return alterNames as any;
    }
    const dateFromStr = format(dateFrom, "yyyy-MM-dd");
    const dateToStr = format(dateTo, "yyyy-MM-dd");
    const tickerAlt = alterNames.data.bloombergToAlter.get(
        ticker.toUpperCase()
    );
    if (!tickerAlt) {
        return err400(
            "string",
            "alternative name for " + ticker + " no found"
        ) as any;
    }
    // prettier-ignore
    let url = `${HOST}api/technical/${tickerAlt}?from=${dateFromStr}&to=${dateToStr}&&function=splitadjusted&fmt=json&api_token=${process.env.EOD_API_KEY}`;
    try {
        const body = await fetch(url);
        const rows = await body.json();
        return okJson(rows);
    } catch (e) {
        return err500(e?.message) as any;
    }
}

function getTickerChunks(items: string[]): string[][] {
    const res: string[][] = [];
    const chunkSize = 50;
    for (let i = 0; i < items.length; i += chunkSize) {
        let end = i + chunkSize;
        if (end > items.length) {
            end = items.length;
        }
        res.push(items.slice(i, end));
    }
    return res;
}

export async function getDayPrice(
    app: IApp,
    tickers: string[],
    date: Date
): Promise<Result<{ ticker: string; close: number; date: string }[]>> {
    const alterNames = await getAlternativeName(app);
    if (isError(alterNames)) {
        return alterNames as any;
    }
    const dateStr = format(date, "yyyy-MM-dd");
    const tickersChunk = getTickerChunks(tickers);
    const rows: { ticker: string; close: number; date: string }[] = [];
    const alterToBloomberg = new Map<string, string>();
    for (const tickerList of tickersChunk) {
        const symbols = tickerList
            .map((el) => {
                const tickerAlt = alterNames.data.bloombergToAlter.get(
                    el.toUpperCase()
                );
                if (!tickerAlt) {
                    return err400(
                        "string",
                        "alternative name for " + el + " no found"
                    ) as any;
                }
                alterToBloomberg.set(tickerAlt, el);
                return tickerAlt;
            })
            .filter((el) => el.indexOf(" ") < 0) // убираем тикеры для которых не нашли альтернативное название
            .join(",");
        // prettier-ignore
        let url = `${HOST}api/eod-bulk-last-day/US?date=${dateStr}&symbols=${symbols}&fmt=json&api_token=${process.env.EOD_API_KEY}`;
        try {
            const body = await fetch(url);
            const items = await body.json();
            // Делаю добавление через фильтр, потому что некоторые акции имеют одинаковые альтернативные имена.
            // Но для расчета нам нужно иметь данные по обоим индексам.
            for (const tickerName of tickerList) {
                const lines = items
                    .filter(
                        (f: {
                            code: any;
                            exchange_short_name: any;
                            date: string;
                        }) =>
                            alterNames.data.bloombergToAlter
                                .get(tickerName.toUpperCase())
                                ?.toUpperCase() ===
                                `${f.code}.${f.exchange_short_name}`.toUpperCase() &&
                            f.date == dateStr
                    )
                    .map((el: { date: string; close: number }) => ({
                        ticker: tickerName,
                        date: el.date,
                        close: el.close
                    }));

                if (lines.length > 0) {
                    rows.push(lines[0]);
                }
            }
        } catch (e) {
            console.error("e", e);
            return err500(e) as any;
        }
    }
    return okJson(rows);
}

export const for_unit_test = { TYPE_SETTINGS };
