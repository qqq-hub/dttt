import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

interface IOptions {
    isUserRequire?: boolean;
    isGroupRequire?: boolean;
}

const validate =
    (schema: AnyZodObject, opt?: IOptions) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (opt?.isUserRequire) {
            const user_id = req.header("user_session_id");
            if (!user_id) {
                return res.status(401).send("неизвестный пользователь");
            }
            req.body.user = user_id;
        }
        if (opt?.isGroupRequire) {
            const group_id = req.header("user_session_group");
            if (!group_id) {
                return res.status(401).send("неизвестная группа");
            }
            req.body.group = group_id;
        }

        try {
            // @ts-ignore
            req.app_params = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (e: any) {
            return res.status(400).send(e.errors);
        }
    };

export default validate;
