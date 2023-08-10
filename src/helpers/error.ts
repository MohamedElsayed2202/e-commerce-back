// import { ICustomeError } from "../interfaces/custome-error"

import CustomeError from "../interfaces/custome-error";

const errorHundler = function(code: number, message: string){
    const error = new CustomeError(code, message);
    throw error
}

export default errorHundler;