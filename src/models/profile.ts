import mongoose, { Schema, Model } from "mongoose";
import { IProfile } from "../interfaces/interfaces";

const schema = new Schema<IProfile, Model<IProfile>>({
    phone: String,
    image: String,
    address: String,
})

const Profile = mongoose.model('Profile', schema);

export default Profile;