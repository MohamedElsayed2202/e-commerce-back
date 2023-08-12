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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controllers/user"));
const upload_1 = require("../middlewares/upload");
const express_validator_1 = require("express-validator");
const user_2 = __importDefault(require("../models/user"));
const authRouter = (0, express_1.Router)();
authRouter.get('', user_1.default.getUsers);
authRouter.post('/add-user', upload_1.upload.single('image'), upload_1.uploadToFirebase, [
    (0, express_validator_1.body)('name').trim().notEmpty().exists(),
    (0, express_validator_1.body)('email').trim().exists().isEmail().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_2.default.findOne({ email: value });
        if (user) {
            return Promise.reject('Emial address already exists!');
        }
    })),
    (0, express_validator_1.body)('password').trim().isStrongPassword({ minLength: 9, minUppercase: 1, minSymbols: 1 }),
    (0, express_validator_1.body)('phone').trim().notEmpty()
], user_1.default.registerUser);
exports.default = authRouter;
