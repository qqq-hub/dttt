import { expect, test } from "@playwright/test";
import { getDayPrice, getHistoryAdjSplits } from "./moex";
import { parse } from "date-fns";

test.describe.parallel("moex", () => {
    test("getHistoryAdjSplits", async () => {
        const dateFrom = parse("2016-05-01", "yyyy-MM-dd", new Date());
        const dateTo = parse("2017-12-01", "yyyy-MM-dd", new Date());
        const res = await getHistoryAdjSplits(
            "NVTK RX Equity",
            dateFrom,
            dateTo
        );
        expect(res.status).toBe(200);
        expect(res.type).toBe("json");
        expect(res.data[0].LEGALCLOSEPRICE).toBe(623);
        expect(res.data[0].TRADEDATE).toBe("2016-05-04");

        const lastIndex = res.data.length - 1;
        expect(res.data[lastIndex].LEGALCLOSEPRICE).toBe(663.5);
        expect(res.data[lastIndex].TRADEDATE).toBe("2017-12-01");

        expect(res.data.length).toBe(402);
    });
    test("getDayPrice", async () => {
        const date = parse("2016-05-04", "yyyy-MM-dd", new Date());
        const mockApp: any = {};
        const res = await getDayPrice(mockApp, ["NVTK RX Equity"], date);
        expect(res.status).toBe(200);
        expect(res.type).toBe("json");

        expect(res.data[0].close).toBe(623);
        expect(res.data[0].date).toBe("2016-05-04");
        expect(res.data[0].ticker).toBe("NVTK RX Equity");
    });
    test("getHistoryAdjSplits imoex index", async () => {
        const dateFrom = parse("2016-05-01", "yyyy-MM-dd", new Date());
        const dateTo = parse("2017-12-01", "yyyy-MM-dd", new Date());
        const res = await getHistoryAdjSplits("IMOEX Index", dateFrom, dateTo);
        expect(res.status).toBe(200);
        expect(res.type).toBe("json");
        expect(res.data[0].LEGALCLOSEPRICE).toBe(1925.58);
        expect(res.data[0].TRADEDATE).toBe("2016-05-04");

        const lastIndex = res.data.length - 1;
        expect(res.data[lastIndex].LEGALCLOSEPRICE).toBe(2105.99);
        expect(res.data[lastIndex].TRADEDATE).toBe("2017-12-01");

        expect(res.data.length).toBe(402);
    });
    test("getDayPrice imoex index", async () => {
        const date = parse("2016-05-04", "yyyy-MM-dd", new Date());
        const mockApp: any = {};
        const res = await getDayPrice(mockApp, ["IMOEX Index"], date);
        expect(res.status).toBe(200);
        expect(res.type).toBe("json");

        expect(res.data[0].close).toBe(1925.58);
        expect(res.data[0].date).toBe("2016-05-04");
        expect(res.data[0].ticker).toBe("IMOEX Index");
    });
});
