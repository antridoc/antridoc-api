import { Inject } from "@tsed/di";
import { BadRequest, NotAcceptable, NotFound } from "@tsed/exceptions";
import moment from "moment";
import { FinishedOptions } from "node:stream";
import { EntityRepository, FindOneOptions, getRepository, In, Not, Repository } from "typeorm";
import { Hospital } from "../entities/Hospital";
import { Patient } from "../entities/Patient";
import { PatientQueue } from "../entities/PatientQueue";
import { Queue } from "../entities/Queue";
import { Schedule } from "../entities/Schedule";
import { User } from "../entities/User";
import { QueuePlatform, QueueStatus } from "../enums/QueueEnums";

@EntityRepository(PatientQueue)
export class PatientQueueRepository extends Repository<PatientQueue> {}

@EntityRepository(Queue)
export class QueueRepository extends Repository<Queue> {

    private current_date = new Date()

    @Inject()
    private patinetQueueRepository: PatientQueueRepository;

    private isAvailableDate(schedule: Schedule, date: Date) {
        if(!schedule.week_days.includes(date.getDay())) throw new BadRequest('Date not available for that day');
        
        if( moment(this.current_date).diff(moment(date), 'days') < 0) throw new BadRequest('Date not available for that date');
        
        return true;
    }

    async getList(): Promise<any> {
        // const queues = 
    }

    async getPatientQueuesByUser(user: User): Promise<PatientQueue []> {
        const patientQueues = await this.patinetQueueRepository.createQueryBuilder('patient_queue')
        // .innerJoin(Patient, 'patient', "patient_queue.patinet_id = patient.id")
        .getMany()

        return patientQueues;
    }
    
    async findOneOrCreate(schedule: Schedule, others?: FindOneOptions<Queue>): Promise<Queue> {
        var queue = await this.findOne({scheduleId: schedule.id, ... others})
        if (!queue) {
            queue = this.create({
                ... others,
                scheduleId: schedule.id,
                hospital: schedule.doctor.hospital,
                doctor_name: schedule.doctor.name,
                polyclinic_name: schedule.polyclinic.name
            });

            return await this.save(queue);
        }
        return queue;
    }

    async getNumberQueueCount(queueId: number, date: Date = new Date()): Promise<number> {
        return await this.patinetQueueRepository.count({queueId});
    }

    async takeQueue(
        schedule: Schedule, 
        patient: Patient, 
        date: Date = new Date(),
        queue_platform: QueuePlatform = QueuePlatform.MOBILE
    ): Promise<PatientQueue> {
        
        this.isAvailableDate(schedule, date)
        
        const queue = await this.findOneOrCreate(schedule, {
            queue_date: date,
            where: {
                status: Not(In([QueueStatus.CLOSE, QueueStatus.CANCELLED]))
            }
        } as FindOneOptions<Queue>)
        
        const patientQueue = this.patinetQueueRepository.create({
            queue: queue,
            patinet_id: patient.id,
            patient_name: patient.full_name,
            patient_email: patient.user ? patient.user.email : patient.email,
            patient_phone: patient.user ? patient.user.phone_number : patient.phone_number,
            patinet_dod: patient.dod,
            queue_platform,
        })

        return await this.patinetQueueRepository.save(patientQueue);
    }

}