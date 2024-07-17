import { expect, test } from "@playwright/test";
import { slop } from "./math";

test.describe.parallel("math", () => {
    test("slop", async () => {
        const knownY = [1, 2, 3, 4];
        const knownX = [5.2, 5.7, 5.0, 4.2];

        expect(slop(knownY, knownX)).toBe(-1.5845824411134994);
    });
});
