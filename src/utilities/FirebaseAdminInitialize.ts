import { Storage } from "@google-cloud/storage";
import { $log } from "@tsed/common";
import * as admin from "firebase-admin";
import { firebase_admin_sdk } from "../config/AppConfig";

const rootDir = __dirname;

export const GCPStorage = new Storage({
    projectId: 'antridoc',
    keyFilename: `${rootDir}/../../storage/firebase/antridoc-firebase-adminsdk.json`
})

export const GCPStorageBucket = GCPStorage.bucket('gs://antridoc.appspot.com')

export function firebaseAdminInitialized(): void {
    admin.initializeApp({
          credential: admin.credential.cert(firebase_admin_sdk),
          databaseURL: 'https://antridoc.firebaseio.com',
    }); 

    if (admin.app.length != 0) {
        $log.info('Firebase initialized') 
    } else {
        $log.error('Firebase not initialized') 
    }
}