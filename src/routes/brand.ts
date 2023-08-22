import { Router } from "express";
import BrandController from "../controllers/brand";
import isAuth from "../middlewares/is-auth";
import { upload, uploadSingleImageToFirebase } from "../middlewares/upload";
import { roleIsNotUser } from "../middlewares/roles";

const brandRouter = Router();

brandRouter.get("/", BrandController.getBrands);
brandRouter.post('/create', isAuth, roleIsNotUser,upload.single('image'), BrandController.createBrand) // add image handler
brandRouter.put('/update/:id', isAuth, roleIsNotUser,upload.single('image'), BrandController.updateBrand); // add image handler
brandRouter.delete('/delete/:id', isAuth, roleIsNotUser,BrandController.deleteBrand);
// brandRouter.get('/:id',)
export default brandRouter;