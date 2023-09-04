import { Location, Schema, checkExact, checkSchema } from "express-validator";
import User from "../models/user";

export const userSchemaValidator:Schema = {
    name: {
        exists: true,
        isString: true,
        trim: true,
        isLength: {
            options: { min:3}
        },
        escape: true,
    },
    email: {
        exists: true,
        trim: true,
        isEmail: true,
        custom: {
            options: async (value:any) => {
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject('emial address already exists!');
                }
            }
        },
        escape: true,
    },
    password: {
        exists: true,
        trim: true,
        isStrongPassword:{
            options: {
                minLength: 9,
                minLowercase: 1,
                minUppercase: 1,
                minSymbols: 1,
            },
            errorMessage: 'Password must be at least 9 characters long with at least 1 lowercase letter, 1 uppercase letter and 1 symbol'
        },
        escape: true,
    },
    role: {
        exists: true,
        trim: true,
        escape: true,
        optional: true,
    },
    phone:{
        exists: true,
        trim: true,
        matches: {
            options: /^01[0125][0-9]{8}$/,
            errorMessage: 'Must provide a valid EG phone number'
        },
        escape: true,
        optional: true
    },
 }


 export const profileSchemaValidator:Schema = {
    name: {
        exists: true,
        isString: true,
        trim: true,
        isLength: {
            options: { min:3}
        },
        optional: true,
        escape: true,
    },
    phone:{
        exists: true,
        trim: true,
        matches: {
            options: /^01[0125][0-9]{8}$/,
            errorMessage: 'Must provide a valid EG phone number'
        },
        escape: true,
        optional: true
    },
    address:{
        exists: true,
        trim: true,
        isString: true,
        optional: true,
        escape: true,
    }
 }

 export const productSchemaValidator:Schema = {
    name: {
        exists: true,
        isString: true,
        trim: true,
        escape: true,
    },
    description: {
        exists: true,
        isString: true,
        trim: true,
        escape: true,
    },
    price:{
        exists: true,
        isNumeric: true,
        trim: true,
        escape: true,
    },
    quantity:{
        exists: true,
        isNumeric: true,
        trim: true,
        escape: true,
    },
    discount:{
        exists: true,
        isNumeric: true,
        trim: true,
        escape: true,
    },
    variations:{
        exists: true,
        isArray: true,
        trim: true,
        escape: true,
    },
    images:{
        exists: true,
        isArray: true,
        trim: true,
        escape: true,
    },
    target:{
        exists: true,
        isString: true,
        trim: true,
        escape: true,
    },
    soldItems: {
        exists: true,
        isNumeric: true,
        trim: true,
        escape: true,
    },
    brandId:{
        exists: true,
        isString: true,
        trim: true,
        escape: true,
    },
    categoryId:{
        exists: true,
        isString: true,
        trim: true,
        escape: true,
    }
 }

  const globalValidator = (schema: any, locations?: Location[]) => checkExact(checkSchema(schema, locations));

  export default globalValidator