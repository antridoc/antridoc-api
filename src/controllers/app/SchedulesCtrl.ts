import { BodyParams, Controller, Get, Inject, PathParams, Post, Put, Req, UseBefore, UseBeforeEach } from "@tsed/common";
import { isNumber } from "@tsed/core";
import { NotFound } from "@tsed/exceptions";
import { CollectionOf, Description, Enum, Example, Groups, Name, Pattern, Required, Summary } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { AllowRoles } from "../../decorators/AllowRoles";
import { Auth } from "../../decorators/Auth";
import { Hospital } from "../../entities/Hospital";
import { Poli } from "../../entities/Poli";
import { Queue } from "../../entities/Queue";
import { Schedule } from "../../entities/Schedule";
import { DaysEnum } from "../../enums/DaysEnum";
import { RolesEnum } from "../../enums/RolesEnum";
import { CheckHospitalIdMiddleware } from "../../middlewares/HospitalMiddleware";
import { DoctorRepository } from "../../repositories/DoctorRepository";
import { PolyRepository } from "../../repositories/PolyRepository";
import { ScheduleRepository } from "../../repositories/ScheduleRepository";
import { ResponsePayload } from "../../utilities/WrapperResponseFilter";

const allwRoles = [RolesEnum.ADMIN_HOSPITAL, RolesEnum.ADMIN_POLI, RolesEnum.OWNER_HOSPITAL]

@Controller('/:hospital_id/schedules')
@Name('Schedules')
@Docs('APP')
@UseBeforeEach(CheckHospitalIdMiddleware)
@Description('[allow roles: admin_poli, admin_hospital, owner_hospital]')
export class SchedulesCtrl {

    @Inject() 
    private scheduleRepository: ScheduleRepository;

    @Inject() 
    private doctorRepository: DoctorRepository;

    @Inject() 
    private polyRepository: PolyRepository;
    
    @Get('')
    @Auth()
    @AllowRoles(allwRoles)
    async index(@Req('hospital') hospital: Hospital ): Promise<ResponsePayload<Poli []>> {
        const schedules = await this.scheduleRepository.getGroupByPolyclinic(hospital)
        return new ResponsePayload({data: schedules})
    }

    @Post('')
    @Auth()
    @AllowRoles(allwRoles)
    async store(
        @Req('hospital') hospital: Hospital, 
        @BodyParams('week_days') @Required() @Example([DaysEnum.Friday, DaysEnum.Monday]) week_days: DaysEnum [],
        @BodyParams('doctorId') @Required()  doctorId: number,
        @BodyParams('polyclinicId') @Required()  polyclinicId: number,
        @BodyParams('time_start') @Required()  @Pattern(/^([01][0-9]|2[0-3]):([0-5][0-9])$/) time_start: string,
        @BodyParams('time_end') @Required()  @Pattern(/^([01][0-9]|2[0-3]):([0-5][0-9])$/) time_end: string,
    ): Promise<ResponsePayload<Schedule>> {
        const new_schedule = this.scheduleRepository.create({week_days, doctorId, polyclinicId, time_end, time_start})

        if (!await this.doctorRepository.checkIdByHospital(hospital, doctorId)) throw new NotFound('Doctor not found!')

        if (!await this.polyRepository.checkIdByHospital(hospital, polyclinicId)) throw new NotFound('Polyclinic not found!')

        const schedule = await this.scheduleRepository.addSchedule(new_schedule)
        return new ResponsePayload({data: schedule})
    }

    @Put('/:id')
    @Auth()
    @AllowRoles(allwRoles)
    async update(
        @Req('hospital') hospital: Hospital, 
        @PathParams('id') @Required() id: number,
        @BodyParams('week_days') @Required() @Example([DaysEnum.Friday, DaysEnum.Monday]) week_days: DaysEnum [],
        @BodyParams('time_start') @Required()  @Pattern(/^([01][0-9]|2[0-3]):([0-5][0-9])$/) time_start: string,
        @BodyParams('time_end') @Required()  @Pattern(/^([01][0-9]|2[0-3]):([0-5][0-9])$/) time_end: string,
    ): Promise<ResponsePayload<Schedule>> {

        if (!await this.scheduleRepository.checkIdByHospital(hospital, id)) throw new NotFound('Schedule not found!')

        const schedule = await this.scheduleRepository.updateByHospital(hospital, {id, week_days, time_end, time_start})

        return new ResponsePayload({data:schedule})
    }

    @Get('/:id')
    @Auth()
    @AllowRoles(allwRoles)
    async getQueueSchedule() {

    }

}