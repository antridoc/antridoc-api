import { Inject } from "@tsed/di";
import { Groups } from "@tsed/schema";
import { EntityRepository, Like, QueryBuilder, Repository, SelectQueryBuilder } from "typeorm";
import { Doctor } from "../entities/Doctor";
import { Hospital } from "../entities/Hospital";
import { DaysEnum } from "../enums/DaysEnum";
import { ScheduleRepository } from "./ScheduleRepository";

@EntityRepository(Doctor)
export class DoctorRepository extends Repository<Doctor> {

    @Inject()
    private scheduleRepository: ScheduleRepository;
    
    async search(): Promise<Doctor []> {
        return this.find()
    }

    async checkIdByHospital(hospital: Hospital, id: number): Promise<boolean> {
        const count = await this.count({
            relations: ['hospital'],
            where: { id, hospital}
        })

        if ( count ) return true
        return false
    } 

    async searchByHospital(@Groups('details') hospital: Hospital, search: string = '', poli_name: string = '' ): Promise<Doctor []> {
        return this.find({
            relations: ['schedules', 'schedules.polyclinic', 'hospital'],
            where: (qb: SelectQueryBuilder<Doctor>) => {
                qb.where('Doctor__hospital.id = :hospital_id', {hospital_id: hospital.id})
                qb.andWhere('LOWER(Doctor.name) LIKE LOWER(:name)', {name: `%${search}%`})
                qb.andWhere('Doctor__schedules__polyclinic.name LIKE :poli_name', {poli_name: `%${poli_name}%`})
            }
        })
    }

}
