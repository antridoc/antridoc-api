import { OnSerialize } from "@tsed/json-mapper";
import { Description, Groups, Ignore, MinLength, Optional, Property } from "@tsed/schema";
import { AfterLoad, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Doctor } from "./Doctor";
import { Poli } from "./Poli";
import { Queue } from "./Queue";
import { User } from "./User";

@Entity()
export class Hospital {
    @Description("Database assigned id")
    @PrimaryGeneratedColumn()
    @Groups("!creation", "details")
    id: number;

    @ManyToOne(() => User, user => user.hospitals)
    @Groups("!details")
    owner: User;

    // @ManyToMany(() => User, user => user.hospitals)
    // @Groups("!details")
    // admins: User [];

    @Column()
    @Groups("creation", "details", "search")
    name: string;

    @Column({nullable: true})
    @Groups("creation", "details")
    phone_number: string;

    @Column({nullable: true})
    @Groups("creation", "details", "search")
    address_line_1: string;

    @Optional()
    @Column({nullable: true})
    @Groups("creation", "details", "search")
    address_line_2: string

    @Optional()
    @Column({nullable: true})
    @Groups("creation", "details", "search")
    province: string
    
    @Optional()
    @Column({nullable: true})
    @Groups("creation", "details", "search")
    regency: string

    @Optional()
    @Column({nullable: true})
    @Groups("creation", "details")
    logitude: number

    @Optional()
    @Column({nullable: true})
    @Groups("creation", "details")
    latitude: number

    @Optional()
    @MinLength(4)
    @Column({nullable: true})
    @Groups("creation", "details")
    zip: string

    @Optional()
    @Column({nullable: true})
    @Groups("creation", "details")
    description: string

    @Optional()
    @Column({nullable: true})
    @Groups("creation", "details")
    photo: string
    
    @CreateDateColumn({ name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    UpdatedAt!: Date;

    @OneToMany(() => Poli, poli => poli.hospital)
    @Groups("details")
    polyclinics: Poli;

    @OneToMany(() => Doctor, doctor => doctor.hospital)
    @Groups("details")
    doctors: Poli;

    @OneToMany(() => Queue, queue => queue.hospital)
    @Groups("details")
    queues: Queue [];

    @Column({unique: true})
    web_app_tag: string;

}