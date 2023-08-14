import mongoose, { Schema, Model } from "mongoose";

export interface IUser{
    name: string,
    email: string,
    password: string,
    photo?: string,
    role: string,
    phone?: string,
    address?: string
}

const schema = new Schema<IUser, Model<IUser>>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    photo: String,
    role: {type: String, enum:['admin','user','owner'], default:'user'},
    phone: String,
    address: String
})

 const UserModel = mongoose.model('User', schema);
 export default UserModel

