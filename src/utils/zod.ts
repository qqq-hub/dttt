import { z } from "zod";

export const checkStringDate = (arg) =>
    z.string(arg).refine(
        (val) => {
            try {
                z.coerce.date().parse(val);
                return true;
            } catch {
                return false;
            }
        },
        {
            message: "Invalid date string"
        }
    );
