"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomeError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.default = CustomeError;
