import { RequestHandler } from "express";
import errorHandler, { errorThrower } from "../helpers/error";
import { verify } from "jsonwebtoken";

const isAuth: RequestHandler = async (req, res, next) => {
    try {
        const token = req.get("Authorization")?.split(' ')[1] || '';
        if(!token){
            errorHandler(401, 'not authenticated.');
        }
        const decodedToken  = verify(token, process.env.token_secret!);
        if(!decodedToken){
            errorHandler(401, 'not authenticated.');
        }
        next();
    } catch (error) {
        errorThrower(error, next)
    }
}

export default isAuth;