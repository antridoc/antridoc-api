import { AcceptMime, Controller, Get, MulterOptions, MultipartFile, PathParams, PlatformMulterFile, Post, Req, Res } from "@tsed/common";
import { NotAcceptable } from "@tsed/exceptions";
import { ContentType, Description, Name, Required } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { extname, join } from "path";
import { Auth } from "../../../decorators/Auth";
import hat from "hat";
import { writeFileSync } from "fs";
import { ResponsePayload } from "../../../utilities/WrapperResponseFilter";
import { FirebaseStorages } from "../../../services/storages/FirebaseStorages";

@Controller('/storage')
@Name('Storage')
@Docs('REST','APP')
export class StorageCtrl {

    private firebaseStorages: FirebaseStorages = new FirebaseStorages()
    
    @Post('/upload')
    @Auth()
    @Description('Accept type file: jpg, jpeg, png, pdf ')
    @ContentType('multipart/form-data')
    @AcceptMime('image/*')
    @MulterOptions({
        limits:{
            fileSize: 6500000,
            files: 1    
        }
    })
    async upload(@Req() req: Req, @MultipartFile('file') @Required() file: PlatformMulterFile): Promise<ResponsePayload<any>> {
        const acceptMime = ['.jpeg', '.pdf', '.png', '.jpg'];
        const ext = extname(file.originalname);
        
        if(!acceptMime.includes(ext)) throw new NotAcceptable('allow file type: jpg, jpeg, png, pdf');

        const finalName = await this.firebaseStorages.upload(file)
        
        return new ResponsePayload({data: {
            file_name: finalName
        }})
    }
    

}