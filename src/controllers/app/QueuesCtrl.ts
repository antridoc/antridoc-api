import { $log, BodyParams, Controller, Get, Inject, PathParams, Post, QueryParams, Req } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { DateFormat, Description, email, Email, Enum, Example, Format, Groups, Name, Optional, Required, Summary } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { AllowRoles } from "../../decorators/AllowRoles";
import { Auth } from "../../decorators/Auth";
import { Patient } from "../../entities/Patient";
import { PatientQueue } from "../../entities/PatientQueue";
import { Queue } from "../../entities/Queue";
import { User } from "../../entities/User";
import { GenderEnum } from "../../enums/GenderEnum";
import { QueuePlatform } from "../../enums/QueueEnums";
import { RolesEnum } from "../../enums/RolesEnum";
import { PatientRepository } from "../../repositories/PatientRepository";
import { QueueRepository } from "../../repositories/QueueRepository";
import { ScheduleRepository } from "../../repositories/ScheduleRepository";
import { FirebaseServices } from "../../services/notifications/Firebase";
import { ResponsePayload } from "../../utilities/WrapperResponseFilter";

@Controller('/queues')
@Name('Queue')
@Docs('APP')
export class QueueCtrl {

    @Inject()
    private queueRepository: QueueRepository;

    @Inject()
    private patientRepository: PatientRepository;

    @Inject()
    private scheduleRepository: ScheduleRepository;

    @Get('/take')
    @Auth()
    @AllowRoles([RolesEnum.PATIENT])
    async takeQueue(
        @Req() req: Req,
        @QueryParams('schedule_id') schedule_id: number,
        @QueryParams('patient_id') patient_id: number,
        @QueryParams('date') @DateFormat() @Description('default: current date') @Optional() date?: Date,
    ): Promise<ResponsePayload<PatientQueue>> {
        const schedule = await this.scheduleRepository.getDetailsById(schedule_id);
        if (!schedule) throw new NotFound('Schedule not found');
        
        const patient = await this.patientRepository.findByIDAndUser(patient_id, req.user);
        if (!patient) throw new NotFound('Patient not found');

        const patientQueue = await this.queueRepository.takeQueue(schedule, patient, date)

        return new ResponsePayload({data: patientQueue})
    }

    @Post('/take')
    @Summary('Direct Queueing')
    async takeQueueAnonymously(
        @Req() req: Req,
        @BodyParams('schedule_id') schedule_id: number,
        @BodyParams('full_name') @Required() full_name: string,
        @BodyParams('gender') @Required() @Enum(GenderEnum.MALE, GenderEnum.FEMALE) @Example('Laki-laki') gender: string,
        @BodyParams('dod') @Required() @DateFormat() @Example('2021-01-31') @Description('use date format: yyyy-mm-dd') dod: Date,
        @BodyParams('phone_number') @Required() @Example('08997531312') phone_number: string,
        @BodyParams('email') @Email() email: string,
        @BodyParams('date') @DateFormat() @Description('default: current date') @Optional() date?: Date,
    ): Promise<ResponsePayload<PatientQueue>> {
        const schedule = await this.scheduleRepository.getDetailsById(schedule_id);
        if (!schedule) throw new NotFound('Schedule not found');
        
        const patient = this.patientRepository.create({full_name, gender, dod, phone_number, email});

        const patientQueue = await this.queueRepository.takeQueue(schedule, patient, date, QueuePlatform.WEBSITE)

        return new ResponsePayload({data: patientQueue})
    }

    @Get('/my-queue')
    @Auth()
    @AllowRoles([RolesEnum.PATIENT])
    async myQueue(@Req() req: Req ): Promise<ResponsePayload<any>> {

        const patientQueues = await this.queueRepository.getPatientQueuesByUser(req.user);

        return new ResponsePayload({data: patientQueues})
    }


}