import { Schema } from "mongoose"

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
    quantaty: number,
    discount: number,
    images: Array<string>,
    colors: Array<string>,
    sizes: Array<string>,
    for: Array<string>,
    soldItems: number,
    reating: number,
    rates: Array<IRate>,
    brandId: Schema.Types.ObjectId,
    categories: Schema.Types.ObjectId
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
    products: Array<Schema.Types.ObjectId>
}

