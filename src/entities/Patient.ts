import { OnDeserialize } from "@tsed/json-mapper";
import { DateFormat, Default, Description, Email, Enum, Example, Groups, Ignore, Optional, Property, Required } from "@tsed/schema";
import { AfterInsert, AfterLoad, AfterUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GenderEnum } from "../enums/GenderEnum";
import { BaseUploadableEntity } from "../services/storages/BaseUploadableEntity";
import { User } from "./User";

@Entity()
export class Patient extends BaseUploadableEntity {

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    async setUrlFile(): Promise<void> {
        this.identity_file = await this.getUrlFile()
    }

    getUploadableFileName(): string {
        return this.identity_file || '';
    }
    
    @Ignore()
    @Groups("!creation", "!details")
    file_path = 'patients';

    @Description("Database assigned id")
    @PrimaryGeneratedColumn()
    @Groups("!creation", "details")
    id: number;

    @Default(false)
    @Column({default: false})
    is_need_trusteeship: boolean

    @Optional()
    @Column({nullable: true})
    family_relationship: string

    @Required()
    @Example('John Gitar')
    @Groups('guest', 'creation', 'details')
    @Column()
    full_name: string

    @Required()
    @Enum(GenderEnum.MALE, GenderEnum.FEMALE)
    @Example('Laki-laki')
    @Column()
    @Groups('guest', 'creation', 'details')
    gender: string

    @Required(true, null)
    @DateFormat()
    @Example('2021-01-31')
    @Description('use date format: yyyy-mm-dd')
    @Column({nullable: true})
    dod: Date

    @Optional()
    @Example('O')
    @Column({nullable: true})
    blod_type: string

    @Optional()
    @Example('Jl. Kemerdekaan no. 40')
    @Column({nullable: true})
    address: string

    @Optional()
    @Column({nullable: true})
    phone_number: string;

    @Optional()
    @Email()
    @Column({nullable: true})
    email: string;

    @Optional()
    @Column({nullable: true})
    identity_type: string
    
    @Optional()
    @Column({nullable: true})
    identity_number: string

    @Optional()
    @Column({nullable: true})
    identity_file?: string


    @Default(false)
    @Column({default: false})
    @Groups("!creation")
    is_main_data: boolean

    @ManyToOne(() => User, user => user.patients)
    user: User;

    @CreateDateColumn({ name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    UpdatedAt!: Date;
}