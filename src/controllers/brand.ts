import { RequestHandler } from "express";
import { IBrand } from "../interfaces/interfaces";
import Brand from "../models/brand";
import { errorHandler, errorThrower } from "../helpers/helpers";
import { deleteSingleImageFromFirebase } from "../middlewares/upload";

class BrandController {

    static createBrand: RequestHandler = async (req, res, next) => {
        try {
            const { name, photo } = req.body;
            const brand = new Brand({
                name,
                logo: photo,
            });
            await brand.save();
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
            const { name, photo } = req.body;
            const brand = await Brand.findByIdAndUpdate(id, {
                name,
                logo: photo,
            }, { new: true });
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