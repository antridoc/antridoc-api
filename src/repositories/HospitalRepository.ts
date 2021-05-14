import { Groups, Schema } from "@tsed/schema";
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

}