import { PlatformMulterFile } from "@tsed/common";
import { extname } from "path";
import hat from "hat";
import {  GCPStorageBucket } from "../../utilities/FirebaseAdminInitialize";


export class FirebaseStorages {

    private temporaryDir = 'tmp/'

    async upload(file: PlatformMulterFile): Promise<string> {
        const ext = extname(file.originalname)
        const finalName = hat() + ext;

        let fileUpload = GCPStorageBucket.file(this.temporaryDir + finalName)
        fileUpload.createWriteStream().end(file.buffer)
        
        return finalName;
    }

    async moveFromTmp(fileName: string, destFileName: string): Promise<void> {
        await GCPStorageBucket.file(this.temporaryDir + fileName).move(destFileName);
    }

    async getPublicUrl(fullPathFile: string): Promise<string> {
        const file = GCPStorageBucket.file(fullPathFile);

        const checkExistingFile = await file.exists();
        if (!checkExistingFile[0]) return '';

        const [url] = await file.getSignedUrl({
                version: 'v2',
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60 * 60 * 24 // one day
        });
        return url;
    }

    async deleteFile(fullPathFile: string): Promise<void> {
        await GCPStorageBucket.file(fullPathFile).delete()
    }

}