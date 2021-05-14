import { OnSerialize } from "@tsed/json-mapper";
import { Description, Groups } from "@tsed/schema";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Hospital } from "./Hospital";
import { Poli } from "./Poli";
import { Schedule } from "./Schedule";

@Entity()
export class Doctor {

    @Description("Database assigned id")
    @PrimaryGeneratedColumn()
    @Groups("!creation", "details")
    id: number;

    @ManyToOne(() => Hospital, hospital => hospital.doctors)
    @Groups("groups.hospital")
    hospital: Hospital;
    
    @Column()
    @Groups("details")
    name: string;

    @Column()
    @Groups("details")
    gender: string;

    @Column({nullable: true})
    @Groups("details")
    address: string;

    @Column({nullable: true})
    @Groups("details")
    phone_number: string;

    @Column({nullable: true})
    @Groups("details")
    specialist: string;

    @Column({nullable: true})
    @Groups("details")
    photo: string

    @CreateDateColumn({ name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    UpdatedAt!: Date;

    @OneToMany(() => Schedule, schedule => schedule.doctor)
    @JoinColumn({referencedColumnName: "doctorId"})
    @Groups("groups.schedules")
    schedules: Schedule;

}