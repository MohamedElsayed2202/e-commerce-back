import { RequestHandler } from "express";
import User, { IUser } from "../models/user";
import errorHundler from "../helpers/error";
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";
import { sign } from "jsonwebtoken";


class Auth {
    static getUsers: RequestHandler = async (req, res, next) => {
        try {
            const users = await User.find();
            if (users.length === 0) {
                errorHundler(404,'No users found.');
            }
            res.status(200).json({users})
        } catch (error: any) {
            errorThrower(error, next);
        }
    }
    static registerUser: RequestHandler =async (req, res, next) => {
        try{
            const errors = validationResult(req);        
            if(!errors.isEmpty()){              
                errorHundler(422, 'Validation faild.', errors.array());
            }
            let {name, email, password, photo, role, phone, address} = req.body as IUser;
            
            password = await bcrypt.hash(password, 12);
            const user = new User({
                 name,
                 email,
                 password,
                 role,
                 photo,
                 phone,
                 address
            })
            // const 
            await user.save();

            res.status(201).json({user});
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