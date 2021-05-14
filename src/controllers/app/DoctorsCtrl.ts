import { Controller, Get, Inject, PathParams, Post, QueryParams, Req, UseBeforeEach } from "@tsed/common";
import { deserialize } from "@tsed/json-mapper";
import { Name, Optional } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { AllowRoles } from "../../decorators/AllowRoles";
import { Auth } from "../../decorators/Auth";
import { Doctor } from "../../entities/Doctor";
import { Hospital } from "../../entities/Hospital";
import { DaysEnum } from "../../enums/DaysEnum";
import { RolesEnum } from "../../enums/RolesEnum";
import { CheckHospitalIdMiddleware } from "../../middlewares/HospitalMiddleware";
import { DoctorRepository } from "../../repositories/DoctorRepository";
import { ScheduleRepository } from "../../repositories/ScheduleRepository";
import { ResponsePayload } from "../../utilities/WrapperResponseFilter";

@Controller('/:hospital_id/doctors')
@Name('Doctors')
@Docs('APP')
@UseBeforeEach(CheckHospitalIdMiddleware)
export class DoctorsCtrl {

    @Inject()
    private doctorRepository: DoctorRepository;

    @Get('/')
    async index(
        @Req('hospital') hospital: Hospital, 
        @QueryParams('search') @Optional() search?: string, 
        @QueryParams('poli_name') @Optional() poli_name?: string
    ): Promise<ResponsePayload<Doctor []>> {
        const doctors = await this.doctorRepository.searchByHospital(hospital, search, poli_name);
        return new ResponsePayload({data: deserialize(doctors, {groups: ['details']})});
    }
}