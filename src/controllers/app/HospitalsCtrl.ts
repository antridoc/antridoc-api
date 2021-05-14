import { BodyParams, Controller, Get, Inject, QueryParams } from "@tsed/common";
import { deserialize } from "@tsed/json-mapper";
import { Groups, Name } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { AllowRoles } from "../../decorators/AllowRoles";
import { Auth } from "../../decorators/Auth";
import { Hospital } from "../../entities/Hospital";
import { Schedule } from "../../entities/Schedule";
import { RolesEnum } from "../../enums/RolesEnum";
import { HospitalRepository } from "../../repositories/HospitalRepository";
import { ResponsePayload } from "../../utilities/WrapperResponseFilter";
import { DoctorsCtrl } from "./DoctorsCtrl";
import { SchedulesCtrl } from "./SchedulesCtrl";

@Controller({
    path: '/hospitals',
    children: [
        DoctorsCtrl,
        SchedulesCtrl,
    ]
})
@Name('Hospitals')
@Docs('APP')
export class HospitalsCtrl {

    @Inject()
    private hospitalRepository: HospitalRepository;

    @Get('/')
    async index(
        @QueryParams('name') name?: string,
        @QueryParams('province') province?: string,
        @QueryParams('regency') regency?: string,
        @QueryParams('address') address?: string
    ): Promise<ResponsePayload<Hospital []>> {
        const hospitals = await this.hospitalRepository.search({name, province, regency, address})
        return new ResponsePayload({data: deserialize(hospitals, {groups: ['details']})})
    }
}