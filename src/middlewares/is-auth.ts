import{ errorHandler } from "../helpers/helpers";
import { verify } from "jsonwebtoken";
import User from "../models/user";
import asyncHandler from "express-async-handler"

const isAuth = asyncHandler(async (req, res, next) => {
        const token = req.get("Authorization")?.split(' ')[1] || '';
        if(!token){
            errorHandler(401, 'unauthorized');
        }
        
        const decodedToken:any  = verify(token, process.env.token_secret!, (err, decoded) => {         
           if(err && err.name === 'TokenExpiredError'){
                errorHandler(403, 'jwt expired');
            }
            if(decoded){
                const {id, role} = <any>decoded
                return {id, role}
            }
        });
        
        if(!decodedToken){
            errorHandler(403, 'access denied');
        }
        const user = await User.findById(decodedToken.id)
        if(!user){
            errorHandler(403, 'access denied');
        }
        req.user = user!;
        next();
})

export default isAuth;