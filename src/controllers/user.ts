import User from "../models/user";
import Token from "../models/token";
import { errorHandler, isValidated, registration, sendEmail } from "../helpers/helpers";
import bcrypt from 'bcryptjs';
import { sign, verify } from "jsonwebtoken";
import { getTokens } from "../helpers/helpers";
import { Tokens } from "../types/custome-types";
import { IFullUser, IProfile } from "../interfaces/interfaces";
import Profile from "../models/profile";
import { deleteSingleImageFromFirebase, uploadSingleImageToFirebase } from "../middlewares/upload";
import asyncHandler from "express-async-handler"

class Auth {
    static getUsers = asyncHandler(async (req, res, next) => {
        const { _id } = req.user!
        // _id: {$ne: id}
        const users = await User.find({ _id: { $ne: _id } }, '-__v -password').populate<{ profile: IProfile }>('profile', '-_id -__v -address -image.id');
        res.status(200).json({ users })
    })
    static register = asyncHandler(async (req, res, next) => {
        isValidated(req);
        const { role: requestUserRole } = req.user!;
        const { role } = req.body;

        if (role && role === 'admin' || role === 'owner') {
            if (requestUserRole !== 'owner') {
                errorHandler(402, 'unauthorised operation, only owner can add admin or owner user');
            }
        }

        const user = await registration(req.body as IFullUser);

        if (user.role === 'admin' || user.role === 'owner') {
            res.status(201).json({ message: `${user.role} user created successfully`, user });
        }

        const { token, refreshToken }: Tokens = await getTokens(user._id.toString(), user.role);

        if (user.role === 'user') {
            const link = `${process.env.BASE_URL}/auth/verify/${user._id}/${refreshToken}`
            await sendEmail(user.email, link, next);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
        }
        res.status(201).json({ token });
    })
    static login = asyncHandler(async (req, res, next) => {
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
    })
    static refresh = asyncHandler(async (req, res, next) => {
        const refreshToken = req.cookies['refreshToken'];

        const data: any = verify(refreshToken, process.env.refresh_secret!);

        if (!data) {
            errorHandler(401, 'unauthenticated')
        }
        const dbToken = await Token.findOne({ userId: data.id, token: refreshToken })

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
        }, process.env.token_secret!, { expiresIn: '1h' });
        res.status(201).json({ token });
    })
    static logout = asyncHandler(async (req, res, next) => {
        const refreshToken = req.cookies['refreshToken'];
        await Token.findOneAndRemove({ token: refreshToken });
        res.cookie('refreshToken', '', { maxAge: 0 });
        res.status(202).json({ message: 'success' });
    })
    static editProfile = asyncHandler(async (req, res, next) => {
        isValidated(req)
        const user = req.user!
        let { name, phone, address } = req.body as IProfile
        if (name !== undefined) {
            user.name = name || user.name;
            await user.save();
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
    })
    static getUserProfile = asyncHandler(async (req, res, next) => {
        const user = req.user!;
        await user.populate<{ profile: IProfile }>('profile', '-_id -__v');
        res.status(200).json({ user });
    })
    static changePassword = asyncHandler(async (req, res, next) => {
        isValidated(req)
        const user = req.user!
        let { password } = req.body
        password = await bcrypt.hash(password, 12);
        user.password = password;
        await user.save();
        res.status(201).jsonp({ message: 'updated successfully.' })
    })
    static verifyEmail = asyncHandler(async (req, res, next) => {
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
    })
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