import { NextFunction, Request, Response } from "express";
import CustomeError from "../interfaces/custome-error";

const errorMiddleware = (error: CustomeError, req: Request, res: Response, next: NextFunction) => {
    const status = error.code || 500;
    const message = error.message
    const data = error.data;
    res.status(status).send({message,data});
}
export default errorMiddleware;