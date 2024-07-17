import type { IRates } from "./types";
import { csvJSON } from "../../../../utils/csv";
import { format, add, parse } from "date-fns";

export async function getRates(): Promise<IRates> {
    const cur = new Date();
    const date = format(add(cur, { days: -1 }), "yyyyMM");
    const curTxt = format(new Date(), "MM/dd/yyyy");
    const result = await fetch(
        `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/all/${date}?type=daily_treasury_yield_curve&field_tdr_date_value_month=${date}&page&_format=csv`
    );
    const data = csvJSON(await result.text());
    const res = {
        date: "",
        items: new Map()
    };
    for (const row of data) {
        if (row.Date !== curTxt) {
            for (const key of Object.keys(row)) {
                if (key === "Date") {
                    continue;
                }
                res.date = format(
                    parse(row.Date, "MM/dd/yyyy", new Date()),
                    "yyyy-MM-dd"
                );
                res.items.set(
                    key.replace('"', "").replace('"', ""),
                    row[key] / 100
                );
            }
            break;
        }
    }
    return res;
}
