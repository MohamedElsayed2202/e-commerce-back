import * as admin from 'firebase-admin'
// import serviceAccount from '../serviceAccountKey.json'
import { v4 as uuidv4 } from 'uuid'
import { NextFunction, Request, RequestHandler } from 'express'
import { getDownloadURL } from 'firebase-admin/storage'
import multer from 'multer'
import path from 'path'
import { errorThrower, getRoleAndId } from '../helpers/helpers'
import User from '../models/user'
import Profile from '../models/profile'

const imageStorge = multer.memoryStorage();
const imageFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
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

const bucket = admin.storage().bucket();

export const upload = multer({ storage: imageStorge, fileFilter: imageFilter });

export const uploadSingleImageToFirebase = async (id: string, dist: string, req: Request, next: NextFunction): Promise<string|undefined> => {
    try {       
        const name = uuidv4();
        const fileName = name + path.extname(req.file!.originalname);
        await bucket.file(`${dist}/${id}/${fileName}`).save(req.file!.buffer);
        const ref = bucket.file(`${dist}/${id}/${fileName}`);
        const url = await getDownloadURL(ref);
        return url;
    } catch (error) {
        errorThrower(error, next)
    }
}

export const deleteSingleImageFromFirebase = async (id: string, dist: string, url: string, next: NextFunction) => {
    
    const fileName = url.replace(/%2F/g, '/').split('/')[9].split('?')[0];
    try {
        await bucket.file(`${dist}/${id}/${fileName}`).delete();
    } catch (error) {
        errorThrower(error, next)
    }
} 


// bucket.file(`${dist}/${id}/${fileName}`).createWriteStream().end(req.file?.buffer).on('finish', async () => {
//     const ref = bucket.file(`${dist}/${id}/${fileName}`)
//      await getDownloadURL(ref)
//     // return downloadUrl
// });

// bucket.deleteFiles({
    //     prefix: `${dist}/${id}/${fileName}`,
    // });
// for deleteing multiple images
// bucket.deleteFiles({
//     prefix : `${dist}/${id}`,
//     // delimiter: `${dist}/${id}`,
//     // startOffset: `/${dist}/${id}/`,
//     // endOffset: `${dist}/${id}`
// });




