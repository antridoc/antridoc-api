import { Inject } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { EntityRepository, getRepository, Repository, SelectQueryBuilder } from "typeorm";
import { Hospital } from "../entities/Hospital";
import { Poli } from "../entities/Poli";
import { Schedule } from "../entities/Schedule";
import { DoctorRepository } from "./DoctorRepository";
import { PolyRepository } from "./PolyRepository";

@EntityRepository(Schedule)
export class ScheduleRepository extends Repository<Schedule> {

    async getDetailsById(id: number): Promise<Schedule> {
        const schedule = await this.findOne({id}, {relations: [ 'doctor', 'doctor.hospital', 'polyclinic' ]})
        if (!schedule) throw new NotFound('Schedule not found!');
        return schedule;
    }

    async checkIdByHospital(hospital: Hospital, id: number): Promise<boolean> {
        const count = await this.count({
            relations: [ 'doctor', 'doctor.hospital'],
            where: (qb: SelectQueryBuilder<Schedule>) => {
                qb.where('Schedule.id = :id', {id})
                qb.andWhere('Schedule__doctor__hospital.id = :hospital_id', {hospital_id: hospital.id})
            }
        })

        if ( count ) return true
        return false
    } 
    
    async getGroupByPolyclinic(hospital: Hospital): Promise<Poli []> {
        const poly = getRepository(Poli)
        return await poly.find({
            relations: [ 'schedules', 'schedules.doctor' ],
            where: {
                hospital,
            }
        })
    }

    async addSchedule(new_schedule: Schedule): Promise<Schedule> {
        const schedule = this.create(new_schedule)
        await this.save(schedule)

        return schedule
    }

    async updateByHospital(hospital: Hospital, schedule: any): Promise<Schedule> {
        const {id, week_days, time_start, time_end} = schedule;

        return await this.save({id, week_days, time_start, time_end})
    }

}