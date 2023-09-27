import { errorHandler } from "../helpers/helpers";
import asyncHandler from "express-async-handler"

const checkRole = (roles: string[]) => asyncHandler(async (req, res,next) => {
    const {role:userRole} = req.user!
    !roles.includes(userRole)? errorHandler(401, "Sorry you do not have access to perform this action") : next();
})
export default checkRole;