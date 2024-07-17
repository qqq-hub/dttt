import { database } from "./database/pg";
import { finance } from "./finance/finance";

export const application: IApp = {
    database,
    finance
};
