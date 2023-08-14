// import { ICustomeError } from "../interfaces/custome-error"

import CustomeError from "../interfaces/custome-error";

const errorHandler = function(code: number, message: string, data?: any){
    const error = new CustomeError(code, message, data);
    throw error
}

export function errorThrower(error: any, next: any): void {
    if (!error.code) {
        error.code = 500;
    }
    next(error);
}

export default errorHandler;