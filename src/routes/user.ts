import { Router } from "express";
import Auth from "../controllers/user";

const authRouter = Router();

authRouter.get('', Auth.getUsers);


export default authRouter