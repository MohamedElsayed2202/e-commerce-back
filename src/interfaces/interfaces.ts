import { Schema } from "mongoose"

export interface IUser{
    name: string,
    email: string,
    password: string,
    role: string,
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