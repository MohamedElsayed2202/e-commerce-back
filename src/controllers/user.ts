import { RequestHandler } from "express";
import User from "../models/user";
import Token from "../models/token";
import { errorHandler, errorThrower, registration } from "../helpers/helpers";
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import { Tokens, getRoleAndId, getTokens, regenerateRefreshToken } from "../helpers/helpers";
import { IFullUser, IProfile, IUser } from "../interfaces/interfaces";
import Profile from "../models/profile";
import { deleteFromFirebase } from "../middlewares/upload";



class Auth {
    static getUsers: RequestHandler = async (req, res, next) => {
        try {
            const users = await User.find({}, '-__v').populate<{profile: IProfile}>('profile','-_id -__v');
            if (users.length === 0) {
                errorHandler(404, 'No users found.');
            }
            res.status(200).json({ users })
        } catch (error: any) {
            errorThrower(error, next);
        }
    }
 
    static registerOwner: RequestHandler = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errorHandler(422, 'Validation faild.', errors.array());
            }
            const user = await registration(req.body as IFullUser, 'owner')
            const { token, refreshToken }: Tokens = await getTokens(user._id.toString(), user.role);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true
            })
            res.status(201).json({ token });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static registerAdmin: RequestHandler = async (req, res, next) => {
        try {
            const { role } = getRoleAndId(req);
            if (role != 'owner') {
                errorHandler(402, 'unauthorised operation');
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errorHandler(422, 'Validation faild.', errors.array());
            }
            const user = await registration(req.body as IFullUser, 'admin')
            res.status(201).json({ user });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static registerUser: RequestHandler = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errorHandler(422, 'Validation faild.', errors.array());
            }
            const user = await registration(req.body as IFullUser)
            const { token, refreshToken }: Tokens = await getTokens(user._id.toString(), user.role);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true
            })
            res.status(201).json({ token });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static login: RequestHandler = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if (!user) {
                errorHandler(400, 'invalid email or password.')
            }
            if (!await bcrypt.compare(password, user!.password)) {
                errorHandler(400, 'invalid email or password.')
            }
            await Token.findOneAndRemove({ userId: user!._id });
            const { token, refreshToken }: Tokens = await getTokens(user!._id.toString(), user!.role);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true
            })
            res.status(201).json({ token, userId: user?._id, role: user?.role });
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
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static logout: RequestHandler = async (req, res, next) => {
        try {
            const refreshToken = req.cookies['refreshToken'];
            await Token.findOneAndRemove({ token: refreshToken });
            res.cookie('refreshToken', '', { maxAge: 0 });
            res.status(202).json({ message: 'success' });
        } catch (error) {
            errorThrower(error, next)
        }
    }

    static editProfile: RequestHandler = async (req, res, next) => {
        try {
            const { id } = getRoleAndId(req)
            let { name, phone, photo, address } = req.body as IProfile
            if(phone !== undefined){
                const regex = /^01[0125][0-9]{8}$/;
                if(!regex.test(phone)){
                    errorHandler(422, 'validation faild', 'Must provide a valid EG phone number');
                }
            }
            const user = await User.findById(id, '-__v');
            if(name !== undefined){
                user!.name = name || user!.name;
                await user!.save();
            }
            const profileId = user!.profile.toString();
            const userProfile = await Profile.findById(profileId,'-__v');
            userProfile!.phone = phone || userProfile?.phone;
            userProfile!.address = address || userProfile?.address;
            userProfile!.photo = photo || userProfile?.photo;
            await userProfile?.save();
            const final = await user?.populate('profile');
            res.status(200).json({message: 'updated successfully', profile: final});
        } catch (error) {
            if(req.body['photo']){
                deleteFromFirebase(req.body['photo'])
            }
            errorThrower(error, next)
        }
    } 
}





export default Auth