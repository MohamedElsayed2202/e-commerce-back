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
import { deleteMultipleImageFromFirebase, deleteSingleImageFromFirebase, upload, uploadMultipleImageToFirebase, uploadSingleImageToFirebase } from './middlewares/upload';

const app = express() 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors);
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/category', categoryRouter);




// in index.js

// for upload single image
// app.post('/api/upload-single', upload.single('image'), async (req, res, next) => {
//     const files = req.file as Express.Multer.File; 
//     const image = await uploadSingleImageToFirebase('1', 'test-images', files, next);
//     res.status(201).json(image);
// })
// // for upload multiple image
// app.post('/api/upload-multiple', upload.array('images', 5), async (req, res, next) => {
//     const files = req.files as Express.Multer.File[]; 
//     const urls = await uploadMultipleImageToFirebase('1', 'test-images', files, next);
//     res.status(201).json(urls);
// })
// // for delete single image
// app.delete('/api/delete-single', async (req, res, next) => {
//     const id = req.body.id as string
//     await deleteSingleImageFromFirebase('1', 'test-images', id, next);
//     res.status(201).json({'message': "successfully deleted"});
// })
// // for delete multiple image
// app.delete('/api/upload-multiple', async (req, res, next) => {
//     const ids = req.body.ids as string[];
//     await deleteMultipleImageFromFirebase('1', 'test-images', ids, next);
//     res.status(201).json({'message': "successfully deleted"});
// })


app.use(errorMiddleware)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port ${process.env.PORT}`);   
    mongoose.connect(process.env.DB!).then(()=>{
        console.log('DB-connected');       
    })
})