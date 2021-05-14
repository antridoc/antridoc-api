import { EntityRepository, Repository } from "typeorm";
import { Hospital } from "../entities/Hospital";
import { Poli } from "../entities/Poli";

@EntityRepository(Poli)
export class PolyRepository extends Repository<Poli> {

    async checkIdByHospital(hospital: Hospital, id: number): Promise<boolean> {
        const count = await this.count({
            relations: ['hospital'],
            where: { id, hospital}
        })

        if ( count ) return true
        return false
    } 

}