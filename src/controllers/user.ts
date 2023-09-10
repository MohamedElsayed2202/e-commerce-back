import { RequestHandler } from "express";
import User from "../models/user";
import Token from "../models/token";
import { errorHandler, errorThrower, isValidated, registration, sendEmail } from "../helpers/helpers";
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import { Tokens, getRoleAndId, getTokens, regenerateRefreshToken } from "../helpers/helpers";
import { IFullUser, IProfile, IUser } from "../interfaces/interfaces";
import Profile from "../models/profile";
import { deleteSingleImageFromFirebase, uploadSingleImageToFirebase } from "../middlewares/upload";

class Auth {
    static getUsers: RequestHandler = async (req, res, next) => {
        try {
            const { id } = getRoleAndId(req)
            // _id: {$ne: id}
            const users = await User.find({ _id: { $ne: id } }, '-__v -password').populate<{ profile: IProfile }>('profile', '-_id -__v -address -image.id');
            // if(users.length === 0 ){
            // res.status(200).json(users)
            // }
            res.status(200).json({ users })
        } catch (error: any) {
            errorThrower(error, next);
        }
    }

    static register: RequestHandler = async (req, res, next) => {
        try {
            isValidated(req);
            const { role: requestUserRole } = getRoleAndId(req);
            const { role } = req.body;

            if (role && role === 'admin' || role === 'owner') {
                if (requestUserRole !== 'owner') {
                    errorHandler(402, 'unauthorised operation, only owner can add admin or owner user');
                }
            }

            const user = await registration(req.body as IFullUser);

            if (user.role === 'admin' || user.role === 'admin') {
                res.status(201).json({ message: `${user.role} user created successfully`, user });
            }

            const { token, refreshToken }: Tokens = await getTokens(user._id.toString(), user.role);
            
            if(user.role === 'user'){
                const link = `${process.env.BASE_URL}/auth/verify/${user._id}/${refreshToken}`
                await sendEmail(user.email, link, next);
            }

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
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
                const data = { 'email': 'This email does not exist.' }
                errorHandler(400, 'invalid email or password.', data)
            }

            if (!await bcrypt.compare(password, user!.password)) {
                const data = { 'password': 'Wrong password' }
                errorHandler(400, 'invalid email or password.', data)
            }

            await Token.findOneAndRemove({ userId: user!._id });

            const { token, refreshToken }: Tokens = await getTokens(user!._id.toString(), user!.role);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })

            res.status(201).json({ token });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static refresh: RequestHandler = async (req, res, next) => {
        try {
            const refreshToken = req.cookies['refreshToken'];
            console.log(refreshToken);
            
            const data: any = verify(refreshToken, process.env.refresh_secret!);
            console.log(data);
            
            if (!data) {
                errorHandler(401, 'unauthenticated')
            }
            const dbToken = await Token.findOne({ userId: data.id })
            console.log(dbToken);
            
            if (!(dbToken!.expiredAt >= new Date())) {
                // await dbToken?.deleteOne();
                errorHandler(440, 'login time-out');
                // const { refreshToken } = await regenerateRefreshToken(data.id, data.role)
                // res.cookie('refreshToken', refreshToken, {
                //     httpOnly: true,
                //     secure: true,
                //     sameSite: 'none',
                // })
            }

            const token = sign({
                id: data.id,
                role: data.role
            }, process.env.token_secret!, { expiresIn: '2h' });

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
            isValidated(req)
            const { id } = getRoleAndId(req)
            let { name, phone, address } = req.body as IProfile
            const user = await User.findById(id, '-__v -password');
            if (name !== undefined) {
                user!.name = name || user!.name;
                await user!.save();
            }
            const profileId = user!.profile.toString();
            const userProfile = await Profile.findById(profileId, '-__v');
            let image;
            if (req.file && userProfile?.image === undefined) {
                image = await uploadSingleImageToFirebase(userProfile!._id.toString(), 'profiles', req.file, next);
            }
            if (req.file && userProfile?.image !== undefined) {
                deleteSingleImageFromFirebase(userProfile!._id.toString(), 'profiles', userProfile.image.id, next);
                image = await uploadSingleImageToFirebase(userProfile!._id.toString(), 'profiles', req.file, next);
            }
            userProfile!.phone = phone || userProfile?.phone;
            userProfile!.address = address || userProfile?.address;
            userProfile!.image = image || userProfile?.image;
            await userProfile?.save();
            const final = await user?.populate('profile', '-_id -__v');
            res.status(200).json({ message: 'updated successfully', user: final });
        } catch (error) {
            errorThrower(error, next)
        }
    }

    static getUserProfile: RequestHandler = async (req, res, next) => {
        try {
            const { id } = getRoleAndId(req);
            const user = await User.findById(id, '-_id -__v -password').populate<{ profile: IProfile }>('profile', '-_id -__v');
            res.status(200).json({ user });
        } catch (error) {
            errorThrower(error, next)
        }
    }

    static changePassword: RequestHandler = async (req, res, next) => {
        try {
            isValidated(req)
            const { id } = getRoleAndId(req);
            let { password } = req.body
            password = await bcrypt.hash(password, 12);
            await User.findByIdAndUpdate(id, {
                password: password
            })
            res.status(201).jsonp({ message: 'updated successfully.' })
        } catch (error) {
            errorThrower(error, next)
        }
    }

    static verifyEmail: RequestHandler = async (req, res, next) => {
        try {
            const { id, token } = req.params;
            const user = await User.findById(id);
            if (!user) {
                errorHandler(400, 'invalid link');
            }
            const refToken = await Token.findOne({
                userId: id,
                token: token
            })
            if (!refToken) {
                errorHandler(400, 'invalid link');
            }
            user!.verified = true;
            user?.save();
            res.status(200).json({ message: 'email verified sucessfully' });
        } catch (error) {
            errorThrower(error, next)
        }
    }
}

export default Auth



// static registerAdmin: RequestHandler = async (req, res, next) => {
    //     try {
    //         const { role } = getRoleAndId(req);
    //         if (role != 'owner') {
    //             errorHandler(402, 'unauthorised operation');
    //         }
    //         isValidated(req)
    //         const user = await registration(req.body as IFullUser, 'admin')
    //         res.status(201).json({ user });
    //     } catch (error) {
    //         errorThrower(error, next);
    //     }
    // }

    // static registerUser: RequestHandler = async (req, res, next) => {
    //     try {
    //         isValidated(req)
    //         const user = await registration(req.body as IFullUser)
    //         const { token, refreshToken }: Tokens = await getTokens(user._id.toString(), user.role);
    //         const link = `${process.env.BASE_URL}/auth/verify/${user._id}/${refreshToken}`
    //         await sendEmail(user.email, link, next);
    //         res.cookie('refreshToken', refreshToken, {
    //             httpOnly: true
    //         })
    //         res.status(201).json({ token });
    //     } catch (error) {
    //         errorThrower(error, next);
    //     }
    // }