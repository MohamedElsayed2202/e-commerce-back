import { errorHandler, isValidated } from "../helpers/helpers";
import Product from "../models/product";
import { IProduct } from "../interfaces/interfaces";
import asyncHandler from "express-async-handler"


class ProductController {
    static getProducts = asyncHandler(async (req, res, next) => {
        const products = await Product.find().select('-__v');
        res.status(200).json(products);
    })

    static getProduct = asyncHandler(async (req, res, next) => {
        const id = req.params.id;
        const product = await Product.findById(id).select('-__v');
        if (!product) {
            errorHandler(404, 'Product not found');
        }
        res.status(200).json({ product })
    })

    static createProduct = asyncHandler(async (req, res, next) => {
        isValidated(req);
        let {
            name,
            description,
            price,
            quantity,
            discount,
            variations,
            images,
            target,
            soldItems,
            brandId,
            categoryId,
        } = req.body as IProduct;
        const product = new Product({
            name,
            description,
            price,
            quantity,
            discount,
            variations,
            images,
            target,
            soldItems,
            brandId,
            categoryId
        });
        await product.save();
        res.status(201).json(product);
    })

    static updateProduct = asyncHandler(async (req, res, next) => {
        const id = req.body.id;
        const product = await Product.findById(id);
        if (!product) {
            errorHandler(404, 'Product not found');
        }
        let {
            name,
            description,
            price,
            quantity,
            discount,
            variations,
            images,
            target,
        } = req.body as IProduct;
        product!.name = name || product!.name;
        product!.description = description || product!.description;
        product!.price = price || product!.price;
        product!.quantity = quantity || product!.quantity;
        product!.discount = discount || product!.discount;
        product!.variations = variations || product!.variations;
        product!.images = images || product!.images;
        product!.target = target || product!.target;
        await product!.save();
        res.status(201).json({
            message: "Brand updated successfully",
            product,
        })
    })

    static deleteProduct = asyncHandler(async (req, res, next) => {
        const id = req.body.id;
        const product = await Product.findByIdAndDelete(id);
        res.status(201).json({
            message: "Product deleted successfully",
            product,
        })

    })
}

export default ProductController;