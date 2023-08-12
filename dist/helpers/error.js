"use strict";
// import { ICustomeError } from "../interfaces/custome-error"
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custome_error_1 = __importDefault(require("../interfaces/custome-error"));
const errorHundler = function (code, message, data) {
    const error = new custome_error_1.default(code, message, data);
    throw error;
};
exports.default = errorHundler;
