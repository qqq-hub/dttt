import * as cheerio from "cheerio";
import { parseTables } from "../../../../utils/cheerio";
import { format, addDays } from "date-fns";
import type { IRates } from "./types";

interface ITableItem {
    name: string;
    bid: number;
    ask: number;
}

const FORWARD_RATES_FIELDS = new Set([
    "EURUSD 1M FWD",
    "EURUSD 2M FWD",
    "EURUSD 3M FWD",
    "EURUSD 6M FWD",
    "EURUSD 1Y FWD",
    "EURUSD 2Y FWD",
    "EURUSD 3Y FWD",
    "EURUSD 5Y FWD",
    "EURUSD 7Y FWD",
    "EURUSD 10Y FWD",
    "EURUSD 20Y FWD",
    "EURUSD 30Y FWD"
]);

interface IRowNDF {
    val: number;
    exp: number;
}

export function getTableNDF(
    rate: number,
    items: ITableItem[]
): Map<string, IRowNDF> {
    const onlyInteresting = items
        .map((el) => ({
            ...el,
            bid: el.bid * 1,
            ask: el.ask * 1,
            name: el.name
                ? el.name.replace(" ", " ").replace(" ", " ")
                : el.name
        }))
        .filter((el) => FORWARD_RATES_FIELDS.has(el.name));
    const res = new Map();
    for (const item of onlyInteresting) {
        const average = (item.bid + item.ask) / 2;
        const cal1 = rate + average / 10000;
        const { name, exp } = getExponent(item.name);
        const cal2 = Math.pow(cal1 / rate, exp) - 1;
        res.set(name, { val: cal2, exp });
    }
    return res;
}

export function getExponent(name: string): { name: string; exp: number } {
    const period = name.split(" ")[1];
    if (period.indexOf("M") > -1) {
        const p = +period.replace("M", "");
        return { name: p + " Mo", exp: 12 / p };
    }
    if (period.indexOf("Y") > -1) {
        const p = +period.replace("Y", "");
        return { name: p + " Yr", exp: 1 / p };
    }

    throw new Error("unknown period");
}

export function calcRates(
    rate: number,
    items: ITableItem[],
    usd: Map<string, number>
): Map<string, number> {
    const ndfs = getTableNDF(rate, items);
    const res = new Map();
    for (const key of ndfs.keys()) {
        const el = ndfs.get(key)!;
        let exp = 0;
        if (key.indexOf("Mo") > -1) {
            exp = +key.replace("Mo", "") / 12;
        } else {
            exp = +key.replace("Yr", "");
        }
        const r = Math.pow(1 + usd.get(key)!, exp) / Math.pow(1 + el.val, exp);
        res.set(key, Math.pow(r, el.exp) - 1);
    }
    return res;
}

async function getRationTable(): Promise<ITableItem[]> {
    const result = await fetch(
        "https://www.investing.com/currencies/eur-usd-forward-rates"
    );
    const $ = cheerio.load(await result.text());
    const items = parseTables($, $("#curr_table"));
    return items;
}

async function getRation(): Promise<{ date: string; value: number }> {
    const result = await fetch(
        "https://www.investing.com/currencies/eur-usd-historical-data"
    );
    const $ = cheerio.load(await result.text());
    const items = parseTables($, $("table.freeze-column-w-1"));
    const res = {
        date: "",
        value: 0
    };
    const cur = format(addDays(new Date(), -1), "MM/dd/yyyy");
    for (const item of items) {
        if (item.date === cur) {
            res.date = format(new Date(item.date), "yyyy-MM-dd");
            res.value = item.price;
            break;
        }
    }
    return res;
}

export async function getRates(
    usd_items: Map<string, number>
): Promise<IRates> {
    const items = await getRationTable();
    const ration = await getRation();
    return {
        date: ration.date,
        items: calcRates(ration.value * 1, items, usd_items)
    };
}
