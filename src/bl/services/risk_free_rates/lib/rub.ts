import type { IRates } from "./types";
import * as cheerio from "cheerio";
import { format, parse } from "date-fns";
import { parseTables } from "../../../../utils/cheerio";

export async function getRates(): Promise<IRates> {
    const result = await fetch("https://www.cbr.ru/hd_base/zcyc_params/zcyc/");
    const $ = cheerio.load(await result.text());
    const scrapedData = parseTables($, $(".data"));
    const date = $(".table-caption.gray").text().trim().replace("на ", "");
    const res = {
        date: format(parse(date, "dd.MM.yyyy", new Date()), "yyyy-MM-dd"),
        items: new Map()
    };
    for (const key of Object.keys(scrapedData[1])) {
        if (key.indexOf("срок") > -1) {
            continue;
        }
        res.items.set(key, scrapedData[1][key] / 100);
    }

    return res;
}
