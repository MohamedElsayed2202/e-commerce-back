import { RequestHandler } from "express";

const cors: RequestHandler = (req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'http://192.168.70.211:3000', 'https://localhost:8080'];
    const origin = req.headers.origin!;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    next();
}

export default cors;