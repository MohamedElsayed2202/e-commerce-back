import mongoose, { Schema, Model } from "mongoose";

interface User{
    name: string,
    email: string,
    password: string,
    photo?: string,
    role: string
}

const schema = new Schema<User, Model<User>>({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    photo: String,
    role: {type: String, enum:['admin','user']}
})

 const UserModel = mongoose.model('User', schema);
 export default UserModel

