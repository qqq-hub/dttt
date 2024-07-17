export const config: {
    server: { port: number };
    db: {
        user: string;
        password: string;
        host: string;
        database: string;
        port: number;
    };
} = {
    server: {
        port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 5001
    },
    db: {
        user: process.env.DB_USER || "user",
        password: process.env.DB_PASS || "user",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_DATABASE || "ytineres",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432
    }
};
