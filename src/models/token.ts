import mongoose, { Schema, Model, Types } from "mongoose";

interface IToken{
    userId: any,
    token: string,
    createdAt: Date,
    expiredAt: Date
}

const schema = new Schema<IToken, Model<IToken>>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    token: {type: String, required: true, unique: true},
    createdAt: {type: Date, default: new Date()},
    expiredAt: {type: Date, required: true}
})

const TokenModel = mongoose.model('Token',schema);

export default TokenModel