import { expect, test } from "@playwright/test";
import { tickersListService } from "./tickers";
import { getTestApp } from "../../utils/tests";

test.describe.parallel("tickers", () => {
    test("list", async () => {
        const app = getTestApp();
        const cases = [{ isActive: true }, { isActive: false }];
        for (let _case of cases) {
            const res = await tickersListService(app, { query: _case });
            expect(res.status).toBe(200);
            expect(res.type).toBe("json");
            expect(res.data).toStrictEqual({
                query: "select data.tickers_list($isActive);",
                params: _case
            });
        }
        const badCases: any = [{ isActive: 123 }, { isActive: "sdf" }, {}];
        for (let _case of badCases) {
            const res = await tickersListService(app, { query: _case });
            expect(res.status).toBe(400);
        }
    });
});
