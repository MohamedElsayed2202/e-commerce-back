// import { ICustomeError } from "../interfaces/custome-error"

import CustomeError from "../interfaces/custome-error";

const errorHundler = function(code: number, message: string, data?: any){
    const error = new CustomeError(code, message, data);
    throw error
}

export default errorHundler;