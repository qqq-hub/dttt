import type { IRates } from "./types";
import { db_risk_free_rates_update } from "../../../models/risk_free_rates";
import { db_notifications_new } from "../../../models/notifications";
import { KURILENKO_ID, SERGEEV_ID } from "../../../../utils/users";

export class CtrlSaverRates {
    private readonly app: IApp;

    constructor(
        app: IApp,
        private user: string
    ) {
        this.app = app;
    }

    async saveRates(
        data: IRates,
        currency: string,
        term_list: Map<string, number>
    ) {
        if (!data.date || !data.items.size) {
            db_notifications_new(this.app, {
                kind: "riskFreeRates::AutoUpdate",
                description: "Проблема авто-обновления " + currency,
                meta: {},
                users: [KURILENKO_ID, SERGEEV_ID, this.user]
            });
            return;
        }
        const items: { term: number; rate: number }[] = [];
        for (const key of data.items.keys()) {
            const rate = data.items.get(key)!;
            const term = term_list.get(key);
            if (term !== undefined) {
                items.push({ term, rate: Number((rate * 100).toFixed(2)) });
            }
        }

        items.length > 0 &&
            (await db_risk_free_rates_update(this.app, {
                currency,
                start_date: data.date,
                items,
                user: this.user
            }));
    }
}
