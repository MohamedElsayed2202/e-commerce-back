import { RequestHandler } from "express";
import { errorHandler, errorThrower, isValidated } from "../helpers/helpers";
import Product from "../models/product";
import { IProduct } from "../interfaces/interfaces";

class ProductController{
    static getProducts: RequestHandler = async (req, res, next) => {
        try {
            const products = await Product.find().select('-__v');
            res.status(200).json(products);
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static getProduct: RequestHandler = async (req, res, next) => {
        try {
            const id = req.params.id;
            const product = await Product.findById(id).select('-__v');
            if(!product){
                errorHandler(404, 'Product not found');
            }
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static createProduct: RequestHandler = async (req, res, next) => {
        try {
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
        } catch (error) {
            errorThrower(error, next)
        }
    }

    static updateProduct: RequestHandler = async (req, res, next) => {
        try {
            const id = req.body.id;
            const product = await Product.findById(id);
            if(!product){
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
            product!.name = name ||  product!.name;
            product!.description = description ||  product!.description;
            product!.price = price ||  product!.price;
            product!.quantity = quantity ||  product!.quantity;
            product!.discount = discount ||  product!.discount;
            product!.variations = variations ||  product!.variations;
            product!.images = images ||  product!.images;
            product!.target = target ||  product!.target;
            await product!.save();
            res.status(201).json({
                message: "Brand updated successfully",
                product,
            })
        } catch (error) {
            errorThrower(error, next)
        }
    }

    static deleteProduct: RequestHandler = async (req, res, next) => {
        try {
            const id = req.body.id;
            const product = await Product.findByIdAndDelete(id);
            res.status(201).json({
                message: "Product deleted successfully",
                product,
            })
        } catch (error) {
            errorThrower(error, next)
        }
    }
}

export default ProductController;