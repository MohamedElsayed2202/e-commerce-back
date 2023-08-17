import mongoose, { Schema, Model } from "mongoose";
import { IProduct, IRate } from "../interfaces/interfaces";

const rateSchema = new Schema<IRate, Model<IRate>>({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    rate: {type: Number, required: true},
    comment: {type: String, required: true}
})

const schema = new Schema<IProduct, Model<IProduct>>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    discount: {type: Number, required: true},
    images: {type: [String], required: true},
    colors: {type: [String], required: true},
    sizes: {type: [String], required: true},
    for: {type: [String], required: true, default:['men', 'women', 'kids']},
    soldItems: {type: Number, required: true, default: 0},
    reating: {type: Number, required: true, default: 0},
    rates: {type: [rateSchema], required: true, default: []},
    brandId: {type: Schema.Types.ObjectId, required: true, ref: 'Brand'},
    categories: {type: Schema.Types.ObjectId, required: true, ref: 'Category'}
})

const Product = mongoose.model('Product', schema);

export default Product;