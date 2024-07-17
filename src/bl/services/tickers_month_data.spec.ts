import { expect, test } from "@playwright/test";
import { for_unit_test } from "./tickers_month_data";
import { okJson } from "../result";
import { format, parse } from "date-fns";
import { getTestApp } from "../../utils/tests";

function _getTestApp(): IApp {
    const app = getTestApp();
    const pDate = (val: string) => parse(val, "yyyy-MM-dd", new Date());
    const history = [
        { ticker: "ticker1", date: pDate("2023-01-30"), value: 100 },
        { ticker: "ticker1", date: pDate("2023-02-28"), value: 102 },
        { ticker: "ticker1", date: pDate("2023-03-31"), value: 104 },
        { ticker: "ticker1", date: pDate("2023-06-29"), value: 104 },
        { ticker: "ticker1", date: pDate("2023-04-30"), value: 103 },
        { ticker: "ticker1", date: pDate("2023-05-28"), value: 105 },
        { ticker: "ticker1", date: pDate("2023-07-30"), value: 107 },
        { ticker: "ticker1", date: pDate("2023-09-30"), value: 111 },
        { ticker: "ticker1", date: pDate("2023-10-29"), value: 112 },
        { ticker: "ticker1", date: pDate("2023-11-26"), value: 110 },
        { ticker: "ticker1", date: pDate("2023-08-31"), value: 110 },
        { ticker: "ticker1", date: pDate("2023-12-31"), value: 113 },
        { ticker: "ticker1", date: pDate("2024-01-30"), value: 114 },
        { ticker: "ticker1", date: pDate("2024-02-27"), value: 113 },
        { ticker: "ticker1", date: pDate("2024-03-30"), value: 115 },

        { ticker: "index1", date: pDate("2023-03-30"), value: 1010 },
        { ticker: "index1", date: pDate("2023-01-31"), value: 1000 },
        { ticker: "index1", date: pDate("2023-02-27"), value: 1005 },
        { ticker: "index1", date: pDate("2023-04-28"), value: 1015 },
        { ticker: "index1", date: pDate("2023-07-30"), value: 1025 },
        { ticker: "index1", date: pDate("2023-05-30"), value: 1014 },
        { ticker: "index1", date: pDate("2023-06-30"), value: 1020 },
        { ticker: "index1", date: pDate("2023-08-31"), value: 1024 },
        { ticker: "index1", date: pDate("2023-09-28"), value: 1030 },
        { ticker: "index1", date: pDate("2023-10-27"), value: 1035 },
        { ticker: "index1", date: pDate("2023-11-20"), value: 1036 },
        { ticker: "index1", date: pDate("2023-12-31"), value: 1040 },
        { ticker: "index1", date: pDate("2024-01-30"), value: 1042 },
        { ticker: "index1", date: pDate("2024-02-27"), value: 1045 },
        { ticker: "index1", date: pDate("2024-03-30"), value: 1050 }
    ];

    app.database = function (query: string, params: any): Promise<Result<any>> {
        if (query.indexOf("data.tickers_prices_month_list") > -1) {
            // prettier-ignore
            expect(format(params.valid_date, "yyyy-MM-dd")).toBe("2023-03-31");
            // prettier-ignore
            expect(format(params.date_from, "yyyy-MM-dd")).toBe("2020-03-31");
            expect(format(params.date_to, "yyyy-MM-dd")).toBe("2023-03-31");
            expect(params.type).toBe("7685225c-af44-4c1a-9829-81273a2580c2");
            return Promise.resolve(okJson(history));
        }
        throw "unknown query";
    };
    return app;
}

test.describe.parallel("services::tickers_month_data", () => {
    test("_calculateBeta", async () => {
        const app = _getTestApp();
        const pointDate = parse("2023-03-31", "yyyy-MM-dd", new Date());
        app.database = app.database.bind({ pointDate });

        const res = await for_unit_test._calculateBeta(app, pointDate, [
            {
                ticker: "ticker1",
                stock_index: "index1",
                native_ticker: null,
                currency: "USD"
            }
        ]);
        expect(res.status).toBe(200);
        expect(res.data.get("ticker1")).toBe(-0.6347345444659194);
    });
});
