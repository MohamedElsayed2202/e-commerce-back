import { RequestHandler } from "express";
import{ errorHandler, errorThrower } from "../helpers/helpers";
import { verify } from "jsonwebtoken";
import User from "../models/user";

const isAuth: RequestHandler = async (req, res, next) => {
    try {
        const token = req.get("Authorization")?.split(' ')[1] || '';
        if(!token){
            errorHandler(401, 'unauthorized');
        }
        
        const decodedToken:any  = verify(token, process.env.token_secret!, (err, decoded) => {         
           if(err && err.name === 'TokenExpiredError'){
                errorHandler(401, 'unauthorized');
            }
            if(decoded){
                const {id, role} = <any>decoded
                return {id, role}
            }
        });
        
        if(!decodedToken){
            errorHandler(401, 'unauthorized');
        }
        const user = await User.findById(decodedToken.id)
        if(!user){
            errorHandler(403, 'access denied');
        }
        next();
    } catch (error) {
        errorThrower(error, next)       
    }
}

export default isAuth;