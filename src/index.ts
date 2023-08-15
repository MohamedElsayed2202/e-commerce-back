import 'dotenv/config'
import express from "express";
import mongoose from 'mongoose';
import errorMiddleware from './middlewares/error';
import authRouter from './routes/user';
import bodyParser from 'body-parser';
import { upload, uploadToFirebase } from './middlewares/upload';
import cors from './middlewares/cors';
import cookieParser from 'cookie-parser';

const app = express() 

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors);
app.use('/api/auth', authRouter);



app.use(errorMiddleware)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port ${process.env.PORT}`);   
    mongoose.connect(process.env.DB!).then(()=>{
        console.log('DB-connected');       
    })
})