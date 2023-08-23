import * as admin from 'firebase-admin'
// import serviceAccount from '../serviceAccountKey.json'
import { v4 as uuidv4 } from 'uuid'
import { NextFunction, Request, RequestHandler } from 'express'
import { getDownloadURL } from 'firebase-admin/storage'
import multer from 'multer'
import path from 'path'
import { errorThrower, getRoleAndId } from '../helpers/helpers'
import { IImage } from '../interfaces/interfaces'


// use import multer from 'multer'
//identifying what kind of multer storage you want
const imageStorge = multer.memoryStorage();

//filtering the files to contain the desired file types
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

// multer middlewares this will give you a single file or array of files depend on how you use it
// single file ==> upload.single('the form field which holds the file') the uploaded file will be in req.file
// multiple files ==> upload.array('the form field which holds the files') the uploaded files will be in req.files
export const upload = multer({ storage: imageStorge, fileFilter: imageFilter });


// use import * as admin from 'firebase-admin'
// intialize and set the credentials of the project and storageBucket 
// notice: save the string credentials in .env file
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.projectId,
        clientEmail: process.env.clientEmail,
        privateKey: process.env.privateKey
    }),
    storageBucket: process.env.BUCKET
})

// create a variable for the bucket 
const bucket = admin.storage().bucket();



// if you don't want to create a nested folder inside firebase storage bucket remove id and dist from all functions
// upload single image to firebase storage
export const uploadSingleImageToFirebase = async (id: string, dist: string, file:  Express.Multer.File, next: NextFunction): Promise<IImage|undefined> => {
    try {       
        const uuid = uuidv4(); // create a unique string
        const fileName = uuid + path.extname(file.originalname); // combine the created uuid with the original name extension
        await bucket.file(`${dist}/${id}/${fileName}`).save(file.buffer); // save the file to firebase storage
        const ref = bucket.file(`${dist}/${id}/${fileName}`); // get the file refrence
        const url = await getDownloadURL(ref); // get the shareable url
        return {url: url, id: fileName}; // returning the image object {url, id} to save in database
    } catch (error) {
        errorThrower(error, next) // a custom function to handle errors
    }
}

// upload multiple images to firebase storage
export const uploadMultipleImageToFirebase = async (id: string, dist: string, files: Express.Multer.File[], next: NextFunction): Promise<Array<IImage>|undefined> => {
    try {     
        const images: IImage[] = []; // list of image objects
        for (const file of files) { // loop through each file
            const image = await uploadSingleImageToFirebase(id, dist, file, next); // calling and waiting the image object returning from  single upload function
            images.push(image!); // push the image to images list
        }
        return images; // returning the images
    } catch (error) {
        errorThrower(error, next)
    }
}

// remove single image from firebase storage
export const deleteSingleImageFromFirebase = async (id: string, dist: string, fileName: string, next: NextFunction) => {    
    try {                                                         
        await bucket.file(`${dist}/${id}/${fileName}`).delete(); // delete the file to firebase storage
    } catch (error) {
        errorThrower(error, next)
    }
} 

//notice: this operation is time consuming, I searched for an alternative way but couldn't find a better solution 
// remove multiple images from firebase storage
export const deleteMultipleImageFromFirebase = async (id: string, dist: string, filesNames: string[], next: NextFunction) => {
    for (const fileName of filesNames) { // loop over urls
        await deleteSingleImageFromFirebase(id, dist, fileName, next); // calling and waiting the excution of the single delete function 
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




