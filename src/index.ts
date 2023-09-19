import 'dotenv/config'
import express from "express";
import mongoose from 'mongoose';
import errorMiddleware from './middlewares/error';
import authRouter from './routes/user';
import bodyParser from 'body-parser';
import cors from './middlewares/cors';
import cookieParser from 'cookie-parser';
import brandRouter from './routes/brand';
import categoryRouter from './routes/category';

const app = express() 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors);
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/category', categoryRouter);
app.use(errorMiddleware)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port ${process.env.PORT}`);   
    mongoose.connect(process.env.DB!).then(()=>{
        console.log('DB-connected');       
    })
})