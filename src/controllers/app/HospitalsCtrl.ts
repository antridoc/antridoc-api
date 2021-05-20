import { BodyParams, Controller, Get, Inject, PathParams, QueryParams } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { deserialize } from "@tsed/json-mapper";
import { Groups, Name } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { get } from "node:http";
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

    @Get("")
    async index(
        @QueryParams('name') name?: string,
        @QueryParams('province') province?: string,
        @QueryParams('regency') regency?: string,
        @QueryParams('address') address?: string
    ): Promise<ResponsePayload<Hospital []>> {
        const hospitals = await this.hospitalRepository.search({name, province, regency, address})
        return new ResponsePayload({data: deserialize(hospitals, {groups: ['details']})})
    }
    @Get("/:id_or_slug")
    async getByIdOrSlug(@PathParams('id_or_slug') id_or_slug: string): Promise<ResponsePayload<Hospital>> {
        const hospital = await this.hospitalRepository.findByIdOrSlug(id_or_slug)
        if (!hospital) throw new NotFound('Hospital not found!')
        return new ResponsePayload({data: deserialize(hospital, {groups: ['details']})})
    }
}