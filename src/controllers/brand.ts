import { RequestHandler } from "express";
import { IBrand } from "../interfaces/interfaces";
import Brand from "../models/brand";
import { errorHandler, errorThrower } from "../helpers/helpers";
import { deleteSingleImageFromFirebase, uploadSingleImageToFirebase } from "../middlewares/upload";

class BrandController {

    static createBrand: RequestHandler = async (req, res, next) => {
        try {
            const { name } = req.body;
            const brand = new Brand({
                name,
            });
            await brand.save();
            let logo 
            if (req.file) {
                logo = await uploadSingleImageToFirebase(brand.id, 'brands', req.file, next);
                if (logo) {
                    brand.logo = logo;
                    await brand.save();
                }
            }
            res.status(201).json({
                message: "Brand created successfully",
                brand,
            });
        } catch (error) {
            errorThrower(error, next)
        }
    }

    static getBrands: RequestHandler = async (req, res, next) => {
        try {
            const brands = await Brand.find({}, '-__v');
            res.status(200).json({
                brands,
            });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static updateBrand: RequestHandler = async (req, res, next) =>{
        try {
            const id = req.params.id;
            const { name } = req.body;
            const brand = await Brand.findById(id);
            let logo;
            if(req.file && brand?.logo === undefined){
                logo = await uploadSingleImageToFirebase(brand!._id.toString(), 'brands', req.file, next);
            }
            if(req.file && brand?.logo !== undefined){
                deleteSingleImageFromFirebase(brand._id.toString(), 'brands', brand.logo.id, next)
                logo = await uploadSingleImageToFirebase(brand!._id.toString(), 'brands', req.file, next);
            }
            brand!.name = name || brand?.name;
            brand!.logo = logo || brand?.logo;
            await brand!.save();
            res.status(201).json({
                message: "Brand updated successfully",
                brand,
            });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static deleteBrand: RequestHandler = async (req, res, next) =>{
        try {
            const id = req.params.id;
            const brand = await Brand.findByIdAndDelete(id);
            // deleteSingleImageFromFirebase(brand!.logo)
            res.status(201).json({
                message: "Brand deleted successfully",
                brand,
            });
        } catch (error) {
            errorThrower(error, next);
        }
    }
}

export default BrandController;