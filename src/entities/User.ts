import {date, DateFormat, Default, Description, Enum, Example, Format, Groups, Ignore, Minimum, MinLength, Optional, Required} from "@tsed/schema";
import {AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { GenderEnum } from "../enums/GenderEnum";
import { RolesEnum } from "../enums/RolesEnum";
import { Hospital } from "./Hospital";
import { Patient } from "./Patient";
import * as bcrypt from 'bcrypt';
import { OnSerialize } from "@tsed/json-mapper";

export class Credentials {
  @Description("User email")
  @Example("user@domain.com")
  @Format("email")
  @Groups('credentials', 'details')
  @Column({unique: true})
  email: string;

  @Groups('credentials','!default', '!details')
  @Description("User password")
  @Example("/5gftuD/")
  @Column()
  @Required()
  password: string;
}

@Entity()
export class User extends Credentials {
  @Description("Database assigned id")
  @PrimaryGeneratedColumn()
  @Groups("!creation", "details")
  id: number;

  @Groups('!update', '!new', '!creation')
  @Column({default: false})
  isVerifiedEmail: boolean

  @Ignore()
  @Column({nullable: true})
  credentialsPin: string

  @Default(RolesEnum.DEFAULT)
  @Groups('!update', '!new')
  @Ignore()
  @Column({default: RolesEnum.DEFAULT})
  role: string

  @Required()
  @MinLength(4)
  @Example('John Gitar')
  @Column()
  full_name: string

  @Required()
  @Format('date')
  @Example('2021-01-31')
  @Description('use date format: yyyy-mm-dd')
  @Column({nullable: true})
  dod: Date

  @Required()
  @Enum(GenderEnum.MALE, GenderEnum.FEMALE)
  @Example('Laki-laki')
  @Column()
  gender: string

  @Optional()
  @Example('087123123')
  @Description('Nomor Telepone')
  @Column({nullable: true})
  phone_number: string

  @CreateDateColumn({ name: 'created_at'})
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  UpdatedAt!: Date;

  @OneToMany(() => Patient, patient => patient.user)
  patients: Patient[];

  @OneToMany(() => Hospital, hospital => hospital.owner)
  hospitals: Hospital[];

  verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }

  verifyCredentialsPin(pin: string) {
    return bcrypt.compareSync(pin, this.credentialsPin)
  }

  @BeforeUpdate() // not work on query builder
  @BeforeInsert()
  encryptPassword() {
    if(this.password) {
      const saltPassword = bcrypt.genSaltSync(10)
      this.password = bcrypt.hashSync(this.password, saltPassword)
    }
  }

  @BeforeUpdate() // not work on query builder
  @BeforeInsert()
  encryptCredentialsPin() {
    if (this.credentialsPin) { 
      const saltPin = bcrypt.genSaltSync(10)
      this.credentialsPin = bcrypt.hashSync(this.credentialsPin, saltPin)
    }
  }
}
