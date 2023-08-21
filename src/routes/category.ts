import { Router } from "express";
import CategoryController from "../controllers/category";
import isAuth from "../middlewares/is-auth";
import { roleIsNotUser } from "../middlewares/roles";

const categoryRouter = Router();

categoryRouter.get("/", CategoryController.getAllCategories);

categoryRouter.post("/create", isAuth, roleIsNotUser, CategoryController.addCategory);

categoryRouter.put("/updae/:id", isAuth, roleIsNotUser, CategoryController.updateCategories);

categoryRouter.delete("/delete/:id", isAuth, roleIsNotUser, CategoryController.deleteCategory);



export default categoryRouter;