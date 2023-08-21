import { RequestHandler } from "express";
import { errorHandler, errorThrower, getRoleAndId } from "../helpers/helpers";

export const roleIsOwner:RequestHandler = async (req, res, next) => {
    try {
        const {role} = getRoleAndId(req);
            if(role !== 'owner') {
                errorHandler(402, 'unauthorised operation');
            }
            next();
    } catch (error) {
        errorThrower(error, next)
    }
} 

export const roleIsAdmin:RequestHandler = async (req, res, next) => {
    try {
        const {role} = getRoleAndId(req);
            if(role !== 'admin') {
                errorHandler(402, 'unauthorised operation');
            }
            next();
    } catch (error) {
        errorThrower(error, next)
    }
} 

export const roleIsUser:RequestHandler = async (req, res, next) => {
    try {
        const {role} = getRoleAndId(req);
            if(role !== 'user') {
                errorHandler(402, 'unauthorised operation');
            }
            next();
    } catch (error) {
        errorThrower(error, next)
    }
}

export const roleIsNotUser:RequestHandler = async (req, res, next) => {
    try {
        const {role} = getRoleAndId(req);
            if(role === 'user') {
                errorHandler(402, 'unauthorised operation');
            }
            next();
    } catch (error) {
        errorThrower(error, next)
    }
} 