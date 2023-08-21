import { Router } from "express";
import Auth from "../controllers/user";
import { upload, uploadToFirebase } from "../middlewares/upload";
import { body } from "express-validator";
import User from "../models/user";
import isAuth from "../middlewares/is-auth";
import globalValidator, { profileSchemaValidator, userSchemaValidator } from "../helpers/validations";
import { roleIsNotUser, roleIsOwner } from "../middlewares/roles";

const authRouter = Router();

authRouter.get('/', isAuth, roleIsNotUser, Auth.getUsers);

authRouter.get('/user-profile', isAuth, Auth.getUserProfile)

authRouter.post('/add-owner', globalValidator(userSchemaValidator), Auth.registerOwner);

authRouter.post('/add-admin', isAuth, roleIsOwner, globalValidator(userSchemaValidator), Auth.registerAdmin);

authRouter.post('/add-user', globalValidator(userSchemaValidator), Auth.registerUser);


authRouter.post('/login', Auth.login);

authRouter.post('/refresh', Auth.refresh);

authRouter.post('/logout', Auth.logout)

authRouter.put('/update-user', isAuth, upload.single('image'), globalValidator(profileSchemaValidator), uploadToFirebase, Auth.editProfile);

authRouter.put('/change-password', isAuth, [
    body('password').trim().isStrongPassword({minLength:9,minUppercase:1,minLowercase:1,minSymbols:1})
], Auth.changePassword)


authRouter.get('/verify/:id/:token', Auth.verifyEmail)



export default authRouter