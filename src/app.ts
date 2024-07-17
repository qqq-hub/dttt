import express, { Request, Response } from "express";
import { config } from "../config/config";
import connect from "./utils/connect";
import routes from "./routes";

const port = config.server.port;

const app = express();

app.use(express.json());

app.listen(port, async () => {
    console.log(`App is running at http://localhost:${port}`);

    await connect();

    routes(app);
});
