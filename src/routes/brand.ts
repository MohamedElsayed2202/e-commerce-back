import { Router } from "express";
import BrandController from "../controllers/brand";
import isAuth from "../middlewares/is-auth";
import { upload, uploadToFirebase } from "../middlewares/upload";

const brandRouter = Router();

brandRouter.get("", BrandController.getBrands);

brandRouter.post('/create', isAuth, upload.single('image'), uploadToFirebase, BrandController.createBrand)

export default brandRouter;