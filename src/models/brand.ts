import mongoose, { Schema, Model } from "mongoose";
import { IBrand } from "../interfaces/interfaces";

const schema = new Schema<IBrand, Model<IBrand>>({
    name: {type: String, required: true},
    logo: {type: String, required: true}
})

const Brand = mongoose.model('Brand', schema);

export default Brand;