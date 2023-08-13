import { RequestHandler } from "express";
import User, { IUser } from "../models/user";
import Token from "../models/token";
import errorHandler from "../helpers/error";
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";
import { sign } from "jsonwebtoken";
import { type } from "os";


class Auth {
    static getUsers: RequestHandler = async (req, res, next) => {
        try {
            const users = await User.find();
            if (users.length === 0) {
                errorHandler(404,'No users found.');
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
                errorHandler(422, 'Validation faild.', errors.array());
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
            await user.save();
            
            const {token, refreshToken}:Tokens = await getTokens(user._id.toString(), user.role);

            res.cookie('refreshToken', refreshToken,{
                httpOnly: true
            })

            res.status(201).json({user, token});
        }catch(error){
            errorThrower(error, next);
        }
    }

    static login: RequestHandler = async (req, res, next)=>{
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email: email});
            if(!user){
                errorHandler(400, 'Invalid email or password.')
            }
            if(!await bcrypt.compare(password, user!.password)){
                errorHandler(400, 'Invalid email or password.')
            }
            await Token.findOneAndRemove({userId: user!._id});
            const {token, refreshToken}:Tokens = await getTokens(user!._id.toString(), user!.role);
            res.cookie('refreshToken', refreshToken,{
                httpOnly: true
            })
            res.status(201).json({token});
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

type Tokens = {
    token: string,
    refreshToken: string
}

async function getTokens(id: string, role: string): Promise<Tokens> {
    const token = sign({
        id: id,
        role: role
    }, process.env.token_secret!, {expiresIn: '2h'});
    const refreshToken = sign({
        id: id
    }, process.env.refresh_secret!);

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);

    const toke = new Token({
        token: refreshToken,
        userId: id,
        expiredAt: expiredAt
    });

    await toke.save();
    return {token, refreshToken}
}

export default Auth