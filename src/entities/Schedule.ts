import { CollectionOf, Description, Enum, Format, Groups, Ignore, Property } from "@tsed/schema";
import { AfterInsert, AfterLoad, AfterUpdate, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DaysEnum } from "../enums/DaysEnum";
import { Doctor } from "./Doctor";
import { Poli } from "./Poli";

@Entity()
export class Schedule {

    @Description("Database assigned id")
    @PrimaryGeneratedColumn()
    @Groups("!creation", "details")
    id: number;

    @Column({type: 'int', array: true})
    @Ignore()
    week_days: DaysEnum [];

    @Format('time')
    @Column()
    time_start: string;
    
    @Format('time')
    @Column()
    time_end: string;

    @Column()
    doctorId: number;

    @Column()
    polyclinicId: number;

    @ManyToOne(() => Doctor, doctor => doctor.schedules)
    @JoinColumn({name: "doctorId"})
    @Groups("groups.doctor", "!creation")
    doctor: Doctor;

    @ManyToOne(() => Poli, poli => poli.schedules)
    @JoinColumn({name: "polyclinicId"})
    @Groups("groups.polyclinic", "!creation")
    polyclinic: Poli;

    @Property()
    days: string [];

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate() 
    daysToString() {
        this.days = this.week_days.map(v => DaysEnum[v])
    }

}
