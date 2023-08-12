"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const error_1 = __importDefault(require("./middlewares/error"));
const user_1 = __importDefault(require("./routes/user"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("./middlewares/cors"));
const app = (0, express_1.default)();
// app.use('/', (req, res, nex) => {
//     res.status(200).send('hello')
// })
app.use(body_parser_1.default.json());
app.use(cors_1.default);
app.use('/auth', user_1.default);
app.use(error_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
    mongoose_1.default.connect(process.env.DB).then(() => {
        console.log('DB-connected');
    });
});
