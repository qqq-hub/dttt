import { expect, test } from "@playwright/test";
import { parsePgQuery } from "./pg";

test.describe.parallel("pg", () => {
    test("parsePgQuery", async () => {
        let res = parsePgQuery("select test($test1,$test2::text)", {
            test1: 123,
            test2: "sdf"
        });
        expect(res).toStrictEqual({
            query: "select test($1,$2::text)",
            params: [123, "sdf"]
        });

        res = parsePgQuery("select test($test1)", { test1: 123 });
        expect(res).toStrictEqual({ query: "select test($1)", params: [123] });

        res = parsePgQuery("select test($test1::int,$test2::text)", {
            test1: 555,
            test2: "one"
        });
        expect(res).toStrictEqual({
            query: "select test($1::int,$2::text)",
            params: [555, "one"]
        });

        res = parsePgQuery("select test()", {});
        expect(res).toStrictEqual({ query: "select test()", params: [] });
    });
});
