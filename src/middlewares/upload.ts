import * as admin from 'firebase-admin'
import serviceAccount from '../serviceAccountKey.json'
import { v4 as uuidv4 } from 'uuid'
import { RequestHandler } from 'express'
import {getDownloadURL} from 'firebase-admin/storage'
import multer from 'multer'
import path from 'path'

const imageStorge = multer.memoryStorage();
const imageFilter = (req: any, file:any, cb:any) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true);
    }else{
        cb(null, false)
    }
};
admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    credential: admin.credential.cert({
        projectId: process.env.projectId,
        clientEmail: process.env.clientEmail,
        privateKey: process.env.privateKey
    }),
    storageBucket: process.env.BUCKET
})
const bucket = admin.storage().bucket()

export const upload = multer({storage: imageStorge, fileFilter: imageFilter});

export const uploadToFirebase:RequestHandler =async (req, res, next) => {
    if(!req.file){
        return next();
    }
    const name = uuidv4();
    const fileName = name + path.extname(req.file!.originalname);
    bucket.file(fileName).createWriteStream().end(req.file?.buffer).on('finish', async ()=>{
        const ref = bucket.file(fileName);
        const downloadUrl = await getDownloadURL(ref);
        req.body['photo'] = downloadUrl;
        next();
    });
} 




