import { z } from "zod";
import {
    STATUS_CREATED,
    err400,
    err500,
    errConflict,
    isError,
    makeResult,
    okJson
} from "../../result";
import {
    SchemaTickersLocalVolDataGet,
    SchemaTickersLocalVolDataList,
    SchemaTickersLocalVolDataSave,
    SchemaTickersLocalVolCalcList,
    SchemaTickersLocalVolCalcNew,
    SchemaTickersLocalVolCalcGetByTickers
} from "../../schema/tickers_local_vol";
import {
    db_tickers_local_vol_data_get,
    db_tickers_local_vol_data_list,
    db_tickers_local_vol_data_save,
    db_tickers_local_vol_calc_get,
    db_tickers_local_vol_calc_save,
    db_tickers_local_vol_calc_get_pre_calc_data,
    db_tickers_local_vol_calc_get_by_tickers
} from "../../models/tickers_local_vol";
import { LocalVolatilitySurface } from "./lib/volatility_surface";
import { differenceInCalendarDays } from "date-fns";

export async function tickersLocalVolDataGetService(
    app: IApp,
    params: z.infer<typeof SchemaTickersLocalVolDataGet>
) {
    return await db_tickers_local_vol_data_get(app, params.query);
}

export async function tickersLocalVolDataSaveService(
    app: IApp,
    params: z.infer<typeof SchemaTickersLocalVolDataSave>
) {
    const res = await db_tickers_local_vol_data_save(app, {
        ...params.body,
        ...params.query
    });

    if (isError(res)) {
        if (res.type === "string" && res.data.indexOf("409") > -1) {
            return errConflict(res.data);
        }
        return res.data as any;
    }
    return makeResult(STATUS_CREATED, "string", res.data);
}

export async function tickersLocalVolDataListService(
    app: IApp,
    params: z.infer<typeof SchemaTickersLocalVolDataList>
) {
    return await db_tickers_local_vol_data_list(app, params.query);
}

export async function tickersLocalVolCalcListService(
    app: IApp,
    params: z.infer<typeof SchemaTickersLocalVolCalcList>
) {
    return await db_tickers_local_vol_calc_get(app, params.query);
}

export async function tickersLocalVolCalcGetByTickersService(
    app: IApp,
    params: z.infer<typeof SchemaTickersLocalVolCalcGetByTickers>
) {
    return await db_tickers_local_vol_calc_get_by_tickers(app, params.body);
}

function toLocalVolatilitySurface(arg: any) {
    const pointDate = new Date(arg.date);
    const riskFreeRates: number[] = [];
    const div: number[] = [];
    const items: number[][] = [];
    const sortedDates = [...arg.dates].sort();
    const sortedStrikes = [...arg.strikes].sort();

    for (let i = 0; i < sortedStrikes.length; i++) {
        items[i] = new Array(sortedDates.length).fill(0);
    }

    for (let i = 0; i < sortedDates.length; i++) {
        const item = arg.items.find((f: any) => f.date === sortedDates[i]);
        if (item) {
            div[i] = parseFloat(item.div) / 100;
            riskFreeRates[i] = parseFloat(item.riskFreeRates) / 100;

            for (let j = 0; j < sortedStrikes.length; j++) {
                items[j][i] =
                    parseFloat(item[sortedStrikes[j].toString()] || 0) / 100;
            }
        }
    }

    return new LocalVolatilitySurface({
        spot: arg.spot,
        days: arg.dates.map((d: string) =>
            differenceInCalendarDays(new Date(d), pointDate)
        ),
        strikes: arg.strikes.map((s: number) => s / 100),
        riskFreeRates,
        div,
        items
    });
}
export async function tickersLocalVolResultNewService(
    app: IApp,
    params: z.infer<typeof SchemaTickersLocalVolCalcNew>
) {
    const data = await db_tickers_local_vol_calc_get_pre_calc_data(
        app,
        params.query
    );
    if (data.status !== 200) {
        return data;
    }
    const item = data.data as any;
    if (!item) {
        return err400("string", "Не найдены данные для расчета!");
    }
    if (item.spot == null) {
        return err400(
            "string",
            `Не найдены цены на указаную точку (${item.date})`
        );
    }
    let resultData = {} as any;
    try {
        const calc = toLocalVolatilitySurface(item);
        const items = calc
            .getResult()
            .map((row) => row.map((value) => (isNaN(value) ? null : value)));
        resultData = {
            shareOfYear: calc.shareOfYear.map((el) => el.toFixed(2)).slice(1),
            strikes: calc.strikes.map((strike) => strike * 100).slice(2),
            items: []
        };
        const nullCoordinates: number[][] = [];
        for (let r = 0; r < items.length; r++) {
            const item = {
                strike: resultData.strikes[r]
            };
            for (let c = 0; c < resultData.shareOfYear.length; c++) {
                const val = resultData.shareOfYear[c];
                item[val.toString()] = items[r][c];
                if (items[r][c] == null) {
                    nullCoordinates.push([r, c]);
                }
            }
            resultData.items.push(item);
        }
        resultData.nullCoordinates = nullCoordinates;
    } catch (e) {
        console.error(e);
        return err500(
            "Расчет локальной волатильности не может быть выполнен на указанных данных"
        );
    }

    const resSave = await db_tickers_local_vol_calc_save(app, {
        uid: params.query.uid,
        creator: params.body.user,
        data: resultData
    });
    if (resSave.status !== 200) {
        return resSave;
    }
    return okJson(resultData);
}
