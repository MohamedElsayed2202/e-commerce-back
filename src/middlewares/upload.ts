import {initializeApp, credential} from 'firebase-admin'
import serviceAccount from '../serviceAccountKey.json'

initializeApp({
    credential: credential.cert(serviceAccount)
})