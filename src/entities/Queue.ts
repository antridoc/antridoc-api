import { Default, Description, Enum, Groups } from "@tsed/schema";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { getAllQueueStatus, QueuePlatform, QueueStatus } from "../enums/QueueEnums";
import { Hospital } from "./Hospital";
import { PatientQueue } from "./PatientQueue";

@Entity()
export class Queue {
    
    @Description("Database assigned id")
    @PrimaryGeneratedColumn()
    @Groups("!creation", "details")
    id: number;

    @ManyToOne(() => Hospital, hospital => hospital.queues)
    @Groups("groups.hospital")
    @JoinTable()
    hospital: Hospital;

    @Default(QueueStatus.INIT)
    @Enum(QueueStatus)
    @Column({type: 'varchar', default: QueueStatus.INIT})
    status: QueueStatus;

    @Column()
    scheduleId: number;

    @Column()
    doctor_name: string;
    
    @Column()
    polyclinic_name: string;

    // @Column({nullable: true})
    // queue_number_perfix?: string;

    // @Column({nullable: true})
    // queue_limit?: number;

    // @Column({array: true})
    // @Enum(QueuePlatform)
    // @Default([QueuePlatform.MOBILE, QueuePlatform.WEBSITE])
    // enable_paltforms: QueuePlatform;

    @Column({type: 'date'})
    queue_date: Date;
    
    @CreateDateColumn({ name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    UpdatedAt!: Date;

    @OneToMany(() => PatientQueue, patientQueue => patientQueue.queue)
    patientQueues: PatientQueue [];

}