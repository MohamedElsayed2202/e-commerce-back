import { RequestHandler } from "express";
import { IBrand } from "../interfaces/interfaces";
import Brand from "../models/brand";
import { errorHandler, errorThrower } from "../helpers/helpers";

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
            if(!(brands.length > 0)){
                errorHandler(404, 'No brands found');
            }
        } catch (error) {
            errorThrower(error, next);
        }
    }
}

export default BrandController;