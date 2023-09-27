import { errorHandler } from "../helpers/helpers";
import { ICategory } from "../interfaces/interfaces";
import Category from "../models/category";
import Product from "../models/product";
import asyncHandler from "express-async-handler"


class CategoryController {
    static addCategory = asyncHandler(async (req, res, next) => {
        const { name } = req.body as ICategory;
        const category = new Category({
            name
        });
        await category.save();
        res.status(201).json({
            message: "Category added successfully",
            category
        });
    })

    static getAllCategories = asyncHandler(async (req, res, next) => {
        const categories = await Category.find().select('-__v');
        res.status(200).json({
            categories
        });
    })

    static updateCategories = asyncHandler(async (req, res, next) => {
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
            })
    })

    static deleteCategory = asyncHandler(async (req, res, next) => {
            const id = req.params.id;
            const category = await Category.findByIdAndDelete(id);
            if (!category) {
                errorHandler(404, 'category not found');
            }
            await Product.deleteMany({ _id: { $in: category?.products } });
            res.status(201).json({ message: "Category added successfully" });
    })
}

export default CategoryController;