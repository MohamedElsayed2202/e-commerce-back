import 'dotenv/config'
import express from "express";
import mongoose from 'mongoose';
import errorMiddleware from './middlewares/error';
import authRouter from './routes/user';
import bodyParser from 'body-parser';
import { upload, uploadToFirebase } from './middlewares/upload';
import cors from './middlewares/cors';

const app = express() 


// app.use('/', (req, res, nex) => {
//     res.status(200).send('hello')
// })
app.use(bodyParser.json());
app.use(cors);
app.use('/auth', authRouter);



app.use(errorMiddleware)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port ${process.env.PORT}`);   
    mongoose.connect(process.env.DB!).then(()=>{
        console.log('DB-connected');       
    })
})