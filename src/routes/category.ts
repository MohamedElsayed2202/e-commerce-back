import { Router } from "express";
import CategoryController from "../controllers/category";
import isAuth from "../middlewares/is-auth";
import checkRole from "../middlewares/roles"; 

const categoryRouter = Router();

categoryRouter.get("/", CategoryController.getAllCategories);

categoryRouter.post("/create", isAuth, checkRole(["admin", "owner"]), CategoryController.addCategory);

categoryRouter.put("/updae/:id", isAuth, checkRole(["admin", "owner"]), CategoryController.updateCategories);

categoryRouter.delete("/delete/:id", isAuth, checkRole(["admin", "owner"]), CategoryController.deleteCategory);



export default categoryRouter;