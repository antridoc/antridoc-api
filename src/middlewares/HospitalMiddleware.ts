import { IMiddleware, Middleware, PathParams, Req } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Required } from "@tsed/schema";
import { Hospital } from "../entities/Hospital";
import { HospitalRepository } from "../repositories/HospitalRepository";

export interface IReqHospital extends Req {
    hospital?: Hospital
}

@Middleware()
export class CheckHospitalIdMiddleware implements IMiddleware {

  constructor(private hospitalService: HospitalRepository) {}

  async use(@Required() @PathParams("hospital_id") hospital_id: number, @Req() req: IReqHospital) {
    const hospital = await this.hospitalService.findOne({id: hospital_id}, {relations: ['polyclinics']});
    
    if (!hospital) {
        throw new NotFound("Hospital not found");
    }else{
        req.hospital = hospital
    }

  }
}
