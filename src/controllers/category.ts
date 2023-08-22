import { RequestHandler } from "express";
import { errorHandler, errorThrower } from "../helpers/helpers";
import { ICategory } from "../interfaces/interfaces";
import Category from "../models/category";
import Product from "../models/product";

class CategoryController {
    static addCategory: RequestHandler = async (req, res, next)=>{
        try {
            const { name } = req.body as ICategory;
            const category = new Category({
                name
            });
            await category.save();     
            res.status(201).json({
                message: "Category added successfully",
                category
            });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static getAllCategories: RequestHandler = async (req, res, next)=>{
        try {
            const categories = await Category.find().select('-__v');
            res.status(200).json({
                categories
            });
        } catch (error) {
            errorThrower(error, next);
        }
    }

    static updateCategories: RequestHandler = async (req, res, next)=>{
        try {
            const id = req.params.id;
            const categories = await Category.findById(id);
            if (!categories) {
                errorHandler(404, 'category not found');
            }
            const { name } = req.body as ICategory;
            categories!.name = name;
            await categories?.save();
            res.status(201).json({
                message: 'category updated successfully',
                categories
            });
        } catch (error) {
            errorThrower(error, next)
        }
    }

    static deleteCategory: RequestHandler = async (req, res, next) => {
        try {
            const id = req.params.id;
            const category = await Category.findByIdAndDelete(id);
            if (!category) {
                errorHandler(404, 'category not found');
            }
            await Product.deleteMany({_id: {$in: category?.products}});
            res.status(201).json({ message: "Category added successfully"});
        } catch (error) {
            errorThrower(error, next)
        }
    }
}

export default CategoryController;