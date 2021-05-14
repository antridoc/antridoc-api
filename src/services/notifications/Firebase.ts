import * as admin from "firebase-admin";
import { projectDir } from "../../config/AppConfig";

export class FirebaseServices {

    async send(): Promise<any> {
        return await admin.messaging().send({
            notification: {
                title: 'message from node',
                body: 'hey there'
            },
            topic: 'test'
        })
    }

}