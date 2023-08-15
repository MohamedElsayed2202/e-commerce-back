import * as admin from 'firebase-admin'
// import serviceAccount from '../serviceAccountKey.json'
import { v4 as uuidv4 } from 'uuid'
import { RequestHandler } from 'express'
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
const bucket = admin.storage().bucket()

export const upload = multer({ storage: imageStorge, fileFilter: imageFilter });

export const uploadToFirebase: RequestHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }
        const { id } = getRoleAndId(req)
        const profileId = await User.findById(id, 'profile');
        const photo = await Profile.findById(profileId?.profile, 'photo');
        if (photo!.photo !== undefined) {
            deleteFromFirebase(photo?.photo!)
        }
        const name = uuidv4();
        const fileName = name + path.extname(req.file!.originalname);
        bucket.file(fileName).createWriteStream().end(req.file?.buffer).on('finish', async () => {
            const ref = bucket.file(fileName);
            const downloadUrl = await getDownloadURL(ref);
            req.body['photo'] = downloadUrl;
            next();
        });
    } catch (error) {
        errorThrower(error, next)
    }
}

export const deleteFromFirebase = async (url: string) => {
    const fileName = url.split('/')[7].split('?')[0]
    await bucket.file(fileName).delete();
}




