import mongoose, { Schema, Model } from "mongoose";
import { ICart } from "../interfaces/interfaces";

const schema = new Schema<ICart, Model<ICart>>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    products: [
        {
            productId: { 
                type: Schema.Types.ObjectId, 
                required: true, 
                ref: "Product" 
            },
            quantity: { 
                type: Number, 
                required: true 
            }
        }
    ],
    totalPrice: { type: Number, required: true }
})

const Cart = mongoose.model('Cart',schema);
export default Cart;