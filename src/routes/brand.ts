import { Router } from "express";
import BrandController from "../controllers/brand";
import isAuth from "../middlewares/is-auth";
import { upload, uploadToFirebase } from "../middlewares/upload";
import { roleIsNotUser } from "../middlewares/roles";

const brandRouter = Router();

brandRouter.get("/", BrandController.getBrands);
brandRouter.post('/create', isAuth, roleIsNotUser,upload.single('image'), uploadToFirebase, BrandController.createBrand)
brandRouter.put('/update/:id', isAuth, roleIsNotUser,upload.single('image'), uploadToFirebase, BrandController.updateBrand);
brandRouter.delete('/delete/:id', isAuth, roleIsNotUser,BrandController.deleteBrand);
// brandRouter.get('/:id',)
export default brandRouter;