import { AfterInsert, AfterUpdate, BeforeRemove } from "typeorm";
import { FirebaseStorages } from "./FirebaseStorages";

export abstract class BaseUploadableEntity {

    abstract file_path: string;
    abstract getUploadableFileName(): string;

    @AfterInsert()
    @AfterUpdate()
    takeFile() {
        if (this.getUploadableFileName()) {
            (new FirebaseStorages()).moveFromTmp(this.getUploadableFileName(), this.file_path + '/' + this.getUploadableFileName())
        }
    }

    @BeforeRemove()
    removeFile() {
        if (this.getUploadableFileName()) (new FirebaseStorages()).deleteFile(this.file_path + '/' + this.getUploadableFileName());
    }

    async getUrlFile(): Promise<string> {
        if (this.getUploadableFileName()) {
            return await (new FirebaseStorages()).getPublicUrl(this.file_path + '/' + this.getUploadableFileName())
        }
        return '';
    }

    replaceFile(new_file_name: string) {
        if (this.getUploadableFileName()) (new FirebaseStorages()).deleteFile(this.file_path + '/' + this.getUploadableFileName());
        (new FirebaseStorages()).moveFromTmp(new_file_name, this.file_path + '/' + new_file_name)
    }

    abstract setUrlFile(): void;

}