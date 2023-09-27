import Brand from "../models/brand";
import { deleteSingleImageFromFirebase, uploadSingleImageToFirebase } from "../middlewares/upload";
import asyncHandler from "express-async-handler"

class BrandController {

    static createBrand = asyncHandler(async (req, res, next) => {
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
    })

    static getBrands = asyncHandler(async (req, res, next) => {
            const brands = await Brand.find({}, '-__v');
            res.status(200).json({
                brands,
            });
    })

    static updateBrand =asyncHandler( async (req, res, next) =>{
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
    })

    static deleteBrand =asyncHandler( async (req, res, next) =>{
            const id = req.params.id;
            const brand = await Brand.findByIdAndDelete(id);
            // deleteSingleImageFromFirebase(brand!.logo)
            res.status(201).json({
                message: "Brand deleted successfully",
                brand,
            })
    })
}

export default BrandController;