"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (error, req, res, next) => {
    const status = error.code || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).send({ message, data });
};
exports.default = errorMiddleware;
