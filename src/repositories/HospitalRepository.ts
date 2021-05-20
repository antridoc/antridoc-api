import { NotFound } from "@tsed/exceptions";
import { Groups, number, Schema } from "@tsed/schema";
import { EntityRepository, Repository } from "typeorm";
import { Hospital } from "../entities/Hospital";

export class SearchHospitals {
    name?: string;
    province?: string;
    regency?: string;
    address?: string;
    point?: [number, number];
}

@EntityRepository(Hospital)
export class HospitalRepository extends Repository<Hospital> {

    async search( search?: SearchHospitals, limit?: number, offset?: number): Promise<Hospital []> {
        return this.find({
            take: limit || 20,
            skip: offset || 0,
            relations: ['polyclinics']
        });
    }

    findById(id: number): Hospital {
        return this.findById(id)
    }

    async findByIdOrSlug(id_or_slug: string | number): Promise<Hospital | undefined> {
        const hospital_id = (typeof id_or_slug == 'number') ? id_or_slug : 0;
        return await this.findOne({
            where: [
                { web_app_tag: id_or_slug },
                { id: hospital_id }
            ],
            relations: ['polyclinics']
        })
    }

}