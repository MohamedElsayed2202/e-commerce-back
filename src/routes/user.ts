import { Router } from "express";
import Auth from "../controllers/user";
import { upload, uploadToFirebase } from "../middlewares/upload";
import { body } from "express-validator";
import User from "../models/user";
import isAuth from "../middlewares/is-auth";

const authRouter = Router();

authRouter.get('', Auth.getUsers);

authRouter.get('/user-profile', isAuth, Auth.getUserProfile)

authRouter.post('/add-owner', [
    body('name').trim().exists().isLength({min: 3}),
    body('email').trim().exists().isEmail().custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            return Promise.reject('Emial address already exists!');
        }
    }),
    body('password').trim().isStrongPassword({minLength:9,minUppercase:1,minLowercase:1,minSymbols:1}),
], Auth.registerOwner);

authRouter.post('/add-admin', isAuth, [
    body('name').trim().exists().isLength({min: 3}),
    body('email').trim().exists().isEmail().custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            return Promise.reject('Emial address already exists!');
        }
    }),
    body('password').trim().isStrongPassword({minLength:9,minUppercase:1,minLowercase:1,minSymbols:1}),
] , Auth.registerAdmin);

authRouter.post('/add-user', [
    body('name').trim().exists().isLength({min: 3}),
    body('email').trim().exists().isEmail().custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            return Promise.reject('Emial address already exists!');
        }
    }),
    body('password').trim().isStrongPassword({minLength:9,minUppercase:1,minLowercase:1,minSymbols:1}),
], Auth.registerUser);


authRouter.post('/login', Auth.login);

authRouter.post('/refresh', Auth.refresh);

authRouter.post('/logout', Auth.logout)

authRouter.put('/update-user', isAuth, upload.single('image'), uploadToFirebase, Auth.editProfile);

authRouter.put('/change-password', isAuth, [
    body('password').trim().isStrongPassword({minLength:9,minUppercase:1,minLowercase:1,minSymbols:1})
], Auth.changePassword)


authRouter.get('/verify/:id/:token', Auth.verifyEmail)



export default authRouter