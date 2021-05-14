import { DateFormat, Description, Groups, Optional } from "@tsed/schema";
import { BeforeInsert, Column, CreateDateColumn, Entity, getManager, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { QueuePlatform } from "../enums/QueueEnums";
import { Queue } from "./Queue";

@Entity()
export class PatientQueue {
    
    @Description("Database assigned id")
    @PrimaryGeneratedColumn()
    @Groups("!creation", "details")
    id: number;

    @Column()
    queueId: number;

    @ManyToOne(() => Queue, queue => queue.patientQueues)
    @JoinColumn({name: 'queueId'})
    queue: Queue;

    @Column()
    queue_number: number;

    @Column({nullable: true})
    @Optional()
    patinet_id?: number;

    @Column()
    patient_name: string;

    @Column()
    patient_phone: string;
    
    @Column({nullable:true})
    @Optional()
    patient_email: string;

    @Column()
    @DateFormat()
    patinet_dod: Date;

    @Column()
    queue_platform: QueuePlatform;

    @CreateDateColumn({ name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    UpdatedAt!: Date;

    @BeforeInsert() 
    async setQueueNumber() {
        this.queue_number = await getManager().count(PatientQueue, {queueId: this.queueId}) + 1
    }

}