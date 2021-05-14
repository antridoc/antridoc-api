import { NotFound } from "@tsed/exceptions";
import {EntityRepository, Repository} from "typeorm";
import { Patient } from "../entities/Patient";
import { User } from "../entities/User";
import { RolesEnum } from "../enums/RolesEnum";

@EntityRepository(Patient)
export class PatientRepository extends Repository<Patient> {
  
  findByID(id: number): Promise<Patient | undefined> {
    return this.findOne(id);
  }

  async findByIDAndUser(id: number, user: User): Promise<Patient | undefined> {
    return await this.findOne({relations: ['user'], where: {id, user}});
  }

  async findByUser(user: User): Promise<Patient []> {
    return await this.find({user})
  }

  async createByUser(user: User, patient: Patient): Promise<Patient> {
    const new_patient = this.create({
      ... patient,
      user,
    })

    return await this.save(new_patient)
  }

  async createFromUser(user: User): Promise<Patient | undefined> {
    const {full_name, gender, dod} = user
    const newPatient = this.create({
      user: user,
      is_main_data: true,
      gender,
      dod,
      full_name
    })
    await this.save(newPatient)
    return newPatient
  }

  async updateByUser(id: number, user: User, patient: Patient): Promise<Patient> {
    const updated = await this.findOne({id, user});
    if(!updated) throw new NotFound('Patient not found');

    const { identity_file } = patient;
    patient.id = id;
    
    if( !identity_file ) {
      delete patient.identity_file;
    } else {
      updated.replaceFile(identity_file);
    }
    
    return await this.save(patient);
  }
}
