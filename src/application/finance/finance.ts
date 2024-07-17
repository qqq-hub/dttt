import { okJson } from "../../bl/result";
import * as eodhistoricaldata from "./providers/eodhistoricaldata";
import * as moexData from "./providers/moex";

export const finance = {
    getDiv: eodhistoricaldata.getDiv,
    getPricesFromRange: getPricesFromRange,
    getDayPrice: getDayPrice
};

async function getPricesFromRange(
    app: IApp,
    dFrom: Date,
    dTo: Date,
    tickers: { ticker: string }[]
): Promise<Result<{ [key: string]: { date: Date; value: number }[] }>> {
    let result: { [key: string]: { date: Date; value: number }[] } = {};
    const cases = [
        {
            f: eodhistoricaldata.getPricesFromRange,
            filter: (el: { ticker: string }) => !isRuShares(el.ticker)
        },
        {
            f: moexData.getPricesFromRange,
            filter: (el: { ticker: string }) => isRuShares(el.ticker)
        }
    ];
    for (const _case of cases) {
        //prettier-ignore
        const res = await _case.f( app, dFrom, dTo, tickers.filter(_case.filter));
        if (res.status === 200) {
            result = { ...result, ...res.data };
        } else {
            return res as any;
        }
    }

    return okJson(result);
}
export async function getDayPrice(
    app: IApp,
    tickers: string[],
    date: Date
): Promise<Result<{ ticker: string; close: number; date: string }[]>> {
    const result: { ticker: string; close: number; date: string }[] = [];

    const cases = [
        {
            f: eodhistoricaldata.getDayPrice,
            filter: (el: string) => !isRuShares(el)
        },
        {
            f: moexData.getDayPrice,
            filter: (el: string) => isRuShares(el)
        }
    ];
    for (const _case of cases) {
        //prettier-ignore
        const res = await _case.f(app, tickers.filter(_case.filter), date);
        if (res.status === 200) {
            result.push(...res.data);
        } else {
            return res as any;
        }
    }

    return okJson(result);
}

const RU_SHARE_LETTERS = new Set(["RM", "RX"]);

function isRuShares(ticker: string): boolean {
    if (ticker === "IMOEX Index") {
        return true;
    }
    return RU_SHARE_LETTERS.has(ticker.split(" ")[1]);
}
