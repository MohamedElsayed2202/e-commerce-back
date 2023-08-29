import { NextFunction, Request, Response } from "express";
import CustomeError from "../interfaces/custome-error";

const errorMiddleware = (error: CustomeError, req: Request, res: Response, next: NextFunction) => {
    const status = error.code ;
    const message = error.message
    const errors = error.errors;
    res.status(status).send({message,errors});
}
export default errorMiddleware;