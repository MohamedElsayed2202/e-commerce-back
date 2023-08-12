"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomeError extends Error {
    constructor(code, message, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
}
exports.default = CustomeError;
