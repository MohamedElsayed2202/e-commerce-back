"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const error_1 = __importDefault(require("../helpers/error"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
class Auth {
}
_a = Auth;
Auth.getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        if (users.length === 0) {
            (0, error_1.default)(404, 'No users found.');
        }
        res.status(200).json({ users });
    }
    catch (error) {
        errorThrower(error, next);
    }
});
Auth.registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, error_1.default)(422, 'Validation faild.', errors.array());
        }
        let { name, email, password, photo, role, phone, address } = req.body;
        password = yield bcryptjs_1.default.hash(password, 12);
        const user = new user_1.default({
            name,
            email,
            password,
            role,
            photo,
            phone,
            address
        });
        yield user.save();
        res.status(201).json({ user });
    }
    catch (error) {
        errorThrower(error, next);
    }
});
function errorThrower(error, next) {
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    next(error);
}
exports.default = Auth;
