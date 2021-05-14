import { Description, Groups } from "@tsed/schema";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Doctor } from "./Doctor";
import { Hospital } from "./Hospital";
import { Schedule } from "./Schedule";

@Entity()
export class Poli {

    @Description("Database assigned id")
    @PrimaryGeneratedColumn()
    @Groups("!creation", "details")
    id: number;

    @ManyToOne(() => Hospital, hospital => hospital.polyclinics)
    @JoinTable()
    hospital: Hospital;
    
    @Column()
    @Groups("creation", "details", "search")
    name: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    UpdatedAt!: Date;

    @OneToMany(() => Schedule, schedule => schedule.polyclinic)
    @Groups("details")
    schedules: Schedule;

}