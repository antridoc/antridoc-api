import { BodyParams, Controller, Delete, Get, Inject, Injectable, PathParams, Post, Put, Req } from "@tsed/common";
import { Forbidden, NotFound } from "@tsed/exceptions";
import { deserialize } from "@tsed/json-mapper";
import { Description, Groups, Name, Summary } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { AllowRoles } from "../../decorators/AllowRoles";
import { Auth } from "../../decorators/Auth";
import { Patient } from "../../entities/Patient";
import { app_allow_roles, RolesEnum } from "../../enums/RolesEnum";
import { PatientRepository } from "../../repositories/PatientRepository";
import { ResponsePayload } from "../../utilities/WrapperResponseFilter";

@Controller('/patients')
@Name('Patients')
@Docs('APP')
@Description('[allow roles: patient]')
export class PatientsCtrl {
    
    @Inject()
    private patientRepository: PatientRepository;

    @Get('')
    @Auth()
    @AllowRoles([RolesEnum.PATIENT])
    @Summary('Get own patients data')
    async index( @Req() req: Req ): Promise<ResponsePayload<Patient []>> {
        const patients = await this.patientRepository.findByUser(req.user);
        return new ResponsePayload({data: deserialize(patients, {type: Patient, groups: ['details']})});
    }

    @Post('')
    @Auth()
    @AllowRoles([RolesEnum.PATIENT])
    async store( @Req() req: Req, @BodyParams() @Groups("creation") new_patient: Patient): Promise<ResponsePayload<Patient>> {
        const patient = await this.patientRepository.createByUser(req.user, new_patient);
        return new ResponsePayload({data: deserialize(patient, {type: Patient, groups: ['details']})});
    }

    @Delete('/:id')
    @Auth()
    @AllowRoles([RolesEnum.PATIENT])
    async delete(@Req() req: Req, @PathParams('id') id: number): Promise<ResponsePayload<any>> {
        const patient = await this.patientRepository.findOne({id, user: req.user});

        if(!patient) throw new NotFound('Patient not found');

        if(patient.is_main_data) throw new Forbidden('Patient is main data');

        await this.patientRepository.remove(patient)
        return new ResponsePayload({data: null});
    }

    @Put('/:id')
    @Auth()
    @AllowRoles([RolesEnum.PATIENT])
    async update(@Req() req: Req, @PathParams('id') id: number, @BodyParams() @Groups("creation") updated_patient: Patient): Promise<ResponsePayload<Patient>> {
        const patient = await this.patientRepository.updateByUser(id, req.user, updated_patient)
        return new ResponsePayload({data: deserialize(patient, {type: Patient, groups: ['details']})});
    }

}