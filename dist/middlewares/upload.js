"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.uploadToFirebase = exports.upload = void 0;
const admin = __importStar(require("firebase-admin"));
const serviceAccountKey_json_1 = __importDefault(require("../serviceAccountKey.json"));
const uuid_1 = require("uuid");
const storage_1 = require("firebase-admin/storage");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const imageStorge = multer_1.default.memoryStorage();
const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey_json_1.default),
    storageBucket: process.env.BUCKET
});
const bucket = admin.storage().bucket();
exports.upload = (0, multer_1.default)({ storage: imageStorge, fileFilter: imageFilter });
const uploadToFirebase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.file) {
        return next();
    }
    const name = (0, uuid_1.v4)();
    const fileName = name + path_1.default.extname(req.file.originalname);
    bucket.file(fileName).createWriteStream().end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer).on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
        const ref = bucket.file(fileName);
        const downloadUrl = yield (0, storage_1.getDownloadURL)(ref);
        req.body['photo'] = downloadUrl;
        next();
    }));
});
exports.uploadToFirebase = uploadToFirebase;
