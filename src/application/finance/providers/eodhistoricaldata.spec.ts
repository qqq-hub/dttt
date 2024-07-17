import { expect, test } from "@playwright/test";
import {
    for_unit_test,
    getDiv,
    getHistoryAdjSplits
} from "./eodhistoricaldata";
import { getTestApp } from "../../../utils/tests";
import { okJson } from "../../../bl/result";
import { parse } from "date-fns";

function _getTestApp(): IApp {
    const app = getTestApp();
    app.database = function (query: string, params: any): Promise<Result<any>> {
        if (query.indexOf("data.settings_data_get") > -1) {
            // prettier-ignore
            expect(params.type).toBe(for_unit_test.TYPE_SETTINGS);

            return Promise.resolve(
                okJson([{ bloomberg: "AAPL UW EQUITY", alter: "AAPL.US" }])
            );
        }
        throw "unknown query";
    };

    return app;
}

test.describe.parallel("eodhistoricaldata", () => {
    test("getDiv", async () => {
        const app = _getTestApp();
        process.env.EOD_API_KEY = "demo";
        const res = await getDiv(app, ["AAPL UW Equity"], 2022);
        expect(res.status).toBe(200);
        expect(res.type).toBe("json");
        expect(res.data.get("AAPL UW Equity")).toBe(0.88);
    });
    test("getHistoryAdjSplits", async () => {
        const app = _getTestApp();
        process.env.EOD_API_KEY = "demo";
        const dateFrom = parse("2010-01-01", "yyyy-MM-dd", new Date());
        const dateTo = parse("2010-03-15", "yyyy-MM-dd", new Date());
        const res = await getHistoryAdjSplits(
            app,
            "AAPL UW Equity",
            dateFrom,
            dateTo
        );
        expect(res.status).toBe(200);
        expect(res.type).toBe("json");
        expect(res.data[0].close).toBe(7.6432);
        expect(res.data[0].date).toBe("2010-01-04");

        const lastIndex = res.data.length - 1;
        expect(res.data[lastIndex].close).toBe(7.9943);
        expect(res.data[lastIndex].date).toBe("2010-03-15");
    });
});
