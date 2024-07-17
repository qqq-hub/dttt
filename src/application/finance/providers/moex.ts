import { err500, isError, okJson } from "../../../bl/result";
import { format } from "date-fns";
import { db_notifications_new } from "../../../bl/models/notifications";
import { KURILENKO_ID, SERGEEV_ID } from "../../../utils/users";

const HOST = "https://iss.moex.com/";

export async function getDayPrice(
    _app: IApp,
    tickers: string[],
    date: Date
): Promise<Result<{ ticker: string; close: number; date: string }[]>> {
    const items: { ticker: string; close: number; date: string }[] = [];
    const dateStr = format(date, "yyyy-MM-dd");
    for (const ticker of tickers) {
        const rows = await getHistoryAdjSplits(ticker, date, date);
        if (rows.data.length > 0 && rows.data[0].TRADEDATE === dateStr) {
            items.push({
                ticker: ticker,
                close: rows.data[0].LEGALCLOSEPRICE,
                date: rows.data[0].TRADEDATE
            });
        }
    }
    return okJson(items);
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
        // prettier-ignore
        const prices = await getHistoryAdjSplits( ticker, dFrom, dTo);
        if (isError(prices)) {
            db_notifications_new(app, {
                kind: "moex::PricesFromRange",
                description:
                    "Проблема получения цен за диапзон времени для тикера " +
                    ticker,
                meta: prices.data,
                users: [KURILENKO_ID, SERGEEV_ID]
            });
            continue;
        }
        result[ticker] = prices.data.map((el) => ({
            value: el.LEGALCLOSEPRICE,
            date: new Date(el.TRADEDATE)
        }));
    }
    return okJson(result);
}

export async function getHistoryAdjSplits(
    ticker: string,
    dateFrom: Date,
    dateTo: Date
): Promise<Result<{ LEGALCLOSEPRICE: number; TRADEDATE: string }[]>> {
    const dateFromStr = format(dateFrom, "yyyy-MM-dd");
    const dateToStr = format(dateTo, "yyyy-MM-dd");
    // prettier-ignore
    let urlTicket = `${HOST}iss/history/engines/stock/markets/shares/boards/TQBR/securities/${ticker.split(" ")[0]}.json?iss.json=extended&from=${dateFromStr}&till=${dateToStr}`;
    if (ticker === "IMOEX Index") {
        urlTicket = `${HOST}iss/history/engines/stock/markets/index/boards/SNDX/securities/IMOEX.json?iss.json=extended&from=${dateFromStr}&till=${dateToStr}`;
    }
    let start: number | null = null;
    const items: { LEGALCLOSEPRICE: number; TRADEDATE: string }[] = [];
    while (true) {
        try {
            let url = urlTicket;
            if (start != null) {
                url += "&start=" + start;
                start = start + 100;
            } else {
                start = 100;
            }
            const body = await fetch(url);
            let rows = (await body.json())[1].history[1] as any[];
            if (rows.length === 0) {
                break;
            }
            if (ticker === "IMOEX Index") {
                rows = rows.map((el) => ({
                    ...el,
                    LEGALCLOSEPRICE: el.CLOSE
                }));
            }
            items.push(...rows);
        } catch (e) {
            return err500(e?.message) as any;
        }
    }
    return okJson(items);
}
