import { Router } from "express";
import Auth from "../controllers/user";
import { upload, uploadToFirebase } from "../middlewares/upload";
import { body } from "express-validator";
import User from "../models/user";

const authRouter = Router();

authRouter.get('', Auth.getUsers);

authRouter.post('/add-user',upload.single('image'), uploadToFirebase,[
    body('name').trim().notEmpty().exists(),
    body('email').trim().exists().isEmail().custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            return Promise.reject('Emial address already exists!');
        }
    }),
    body('password').trim().isStrongPassword({minLength:9,minUppercase:1,minSymbols:1}),
    body('phone').trim().notEmpty()
] , Auth.registerUser);

export default authRouter