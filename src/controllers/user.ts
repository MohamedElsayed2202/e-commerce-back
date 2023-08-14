import { RequestHandler } from "express";
import User, { IUser } from "../models/user";
import Token from "../models/token";
import errorHandler, { errorThrower } from "../helpers/error";
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import { Tokens, getTokens, regenerateRefreshToken } from "../helpers/token";


class Auth {
    static getUsers: RequestHandler = async (req, res, next) => {
        try {
            const users = await User.find();
            if (users.length === 0) {
                errorHandler(404, 'No users found.');
            }
            res.status(200).json({ users })
        } catch (error: any) {
            errorThrower(error, next);
        }
    }
    static registerUser: RequestHandler = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errorHandler(422, 'Validation faild.', errors.array());
            }
            let { name, email, password, photo, role, phone, address } = req.body as IUser;

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

            const { token, refreshToken }: Tokens = await getTokens(user._id.toString(), user.role);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true
            })

            res.status(201).json({ user, token });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static login: RequestHandler = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if (!user) {
                errorHandler(400, 'Invalid email or password.')
            }
            if (!await bcrypt.compare(password, user!.password)) {
                errorHandler(400, 'Invalid email or password.')
            }
            await Token.findOneAndRemove({ userId: user!._id });
            const { token, refreshToken }: Tokens = await getTokens(user!._id.toString(), user!.role);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true
            })
            res.status(201).json({ token });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static refresh: RequestHandler = async (req, res, next) => {
        try {
            const refreshToken = req.cookies['refreshToken'];
            const data: any = verify(refreshToken, process.env.refresh_secret!)
            if (!data) {
                errorHandler(401, 'unauthenticated')
            }
            const dbToken = await Token.findOne({ userId: data.id })
            if (!(dbToken!.expiredAt >= new Date())) {
                const { refreshToken } = await regenerateRefreshToken(data.id, data.role)
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
            }
            const token = sign({
                id: data.id,
                role: data.role
            }, process.env.token_secret!)
            res.status(201).json({ token });
        }catch(error){
            errorThrower(error, next);
        }
    }

    static logout: RequestHandler =async (req, res, next) => {
        try {
            const refreshToken = req.cookies['refreshToken'];
            await Token.findOneAndRemove({token: refreshToken});
            res.cookie('refreshToken', '', {maxAge:0});
            res.status(202).json({message: 'success'});
        } catch (error) {
            errorThrower(error, next)
        }
    }
}





export default Auth