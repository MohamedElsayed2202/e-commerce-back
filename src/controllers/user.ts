import { RequestHandler } from "express";
import User from "../models/user";
import errorHundler from "../helpers/error";
class Auth {
    static getUsers: RequestHandler = async (req, res, next) => {
        try {
            const users = await User.find();
            if (users.length === 0) {
                errorHundler(404,'No users found.');
            }
        } catch (error: any) {
            errorThrower(error, next);
        }
    }
    static registerUser: RequestHandler =async (req, res, next) => {
        try{
            
        }catch(error){
            errorThrower(error, next);
        }
    }
}

function errorThrower(error: any, next: any): void{
    if(!error.statusCode){
        error.statusCode = 500;
    }
    next(error);
}

export default Auth