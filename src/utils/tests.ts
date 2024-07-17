import { okJson } from "../bl/result";

export function getTestApp(): IApp {
    return {
        database: (query: string, params: any): Promise<Result<any>> => {
            return Promise.resolve(okJson({ query, params }));
        },
        finance: {
            getDiv: (
                app: IApp,
                tickers: string[],
                year: number
            ): Promise<Result<Map<string, number>>> => {
                return Promise.resolve(okJson(new Map()));
            },
            getPricesFromRange: (
                app: IApp,
                dFrom,
                dTo,
                tickers: { ticker: string }[]
            ): Promise<
                Result<{ [key: string]: { date: Date; value: number }[] }>
            > => {
                return Promise.resolve(okJson({} as any));
            },
            getDayPrice: (
                app: IApp,
                tickers: string[],
                date: Date
            ): Promise<
                Result<
                    {
                        ticker: string;
                        close: number;
                        date: string;
                    }[]
                >
            > => {
                return Promise.resolve(okJson({} as any));
            }
        }
    };
}
