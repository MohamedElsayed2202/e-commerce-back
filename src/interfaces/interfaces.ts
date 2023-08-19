import { Schema, Types } from "mongoose"

export interface IUser{
    name: string,
    email: string,
    password: string,
    role: string,
    verified?: boolean,
    profile: Schema.Types.ObjectId,
}


export interface IFullUser{
    name: string,
    email: string,
    password: string,
    role: string,
    phone?: string,
    address?: string
}


export interface IToken{
    userId: Schema.Types.ObjectId,
    token: string,
    createdAt: Date,
    expiredAt: Date
}

export interface IProfile{
    phone?: string,
    photo?: string,
    address?: string,
    name?: string
}

export interface IProduct {
    name: string,
    description: string,
    price: number,
    quantity: number,
    discount: number,
    variations: Types.DocumentArray<IVariation>
    images: Types.Array<string>,
    // colors: Types.Array<string>,
    // sizes: Types.Array<string>,
    for: Types.Array<string>,
    soldItems: number,
    reating: number,
    rates: Types.DocumentArray<IRate>,
    brandId: Schema.Types.ObjectId,
    categories: Schema.Types.ObjectId
}

export interface IVariation{
    color: string,
    sizes: Types.DocumentArray<ISize>
}

export interface ISize{
    size: string,
    quantity: number
}

export interface IRate{
    userId: Schema.Types.ObjectId,
    rate: number,
    comment: string
}

export interface IBrand{
    name: string,
    logo: string,
}

export interface ICategory{
    name: string,
    products: Types.Array<Schema.Types.ObjectId>
}

export interface ICart{
    userId: Schema.Types.ObjectId,
    products: Types.DocumentArray<ICartProduct>,
    totalPrice: number
}

export interface ICartProduct{
    productId: Schema.Types.ObjectId,
    quantity: number
}

export interface IOrder{
    userId: Schema.Types.ObjectId,
    cartId: Schema.Types.ObjectId,
    status: string
}