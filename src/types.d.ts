type TYPE_RESULT = "json" | "string" | "number";

type Result<T> = {
    status: number;
    type: TYPE_RESULT;
    data: T;
};

interface IApp {
    database: (query: string, params: any) => Promise<Result<any>>;
    finance: {
        getDiv: (
            app: IApp,
            tickers: string[],
            year: number
        ) => Promise<Result<Map<string, number>>>;
        getPricesFromRange: (
            app: IApp,
            dFrom,
            dTo,
            tickers: { ticker: string }[]
        ) => Promise<
            Result<{
                [key: string]: { date: Date; value: number }[];
            }>
        >;
        getDayPrice(
            app: IApp,
            tickers: string[],
            date: Date
        ): Promise<Result<{ ticker: string; close: number; date: string }[]>>;
    };
}
