import { NotFound, Unauthorized } from "@tsed/exceptions";
import { email, Groups } from "@tsed/schema";
import * as jwt from "jsonwebtoken"
import {EntityRepository, Repository} from "typeorm";
import AppConfig from "../config/AppConfig";
import {User} from "../entities/User";
import { ResponseMessageEnum } from "../enums/ResponseMessageEnum";
import { RolesEnum } from "../enums/RolesEnum";
import { SendGridMailService } from "../services/email/SendGridMailService";
import { generatePinSync } from 'secure-pin';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  mailService: SendGridMailService = new SendGridMailService()

  findByID(id: string): Promise<User | undefined> {
    return this.findOne(id);
  }

  async createNew(user: User): Promise<User | undefined> {
    const newUser = this.create({
      ... user,
      role: RolesEnum.DEFAULT
    });

    await this.save(newUser);

    const email_verification_link = this.generateEmailVerificationLink(newUser);
    await this.mailService.welcomeEmail({name: newUser.full_name, email: newUser.email});
    await this.mailService.verifyEmail({name: newUser.full_name, email: newUser.email}, email_verification_link);

    return newUser;
  } 

  async updateProfile(email: string, @Groups('update') profile: User): Promise<User> {
    const updateUser = await this.findOne({email});
    if(!updateUser) throw new Unauthorized('User not found!');

    return await this.save({
      id: updateUser.id,
      full_name: profile.full_name,
      dod: profile.dod,
      gender: profile.gender,
      phone_number: profile.phone_number,
    } as User);
    
  }

  generateEmailVerificationLink(user: User): string {
    const verifyToken = jwt.sign({
        email: user.email,
        id: user.id,
        slug: 'antridoc-email-token'
    }, AppConfig.JWT_SECRET, { expiresIn: '3 days' } );
    
    return AppConfig.BASE_URL + '/auth/verify-email?token=' + verifyToken;
  }

  async verifyEmailToken(token: string): Promise<User | any> {
    const payload: any = jwt.verify(token, AppConfig.JWT_SECRET);
    const user = await this.findOne({email: payload.email});

    if (!user || payload.slug != 'antridoc-email-token') throw new NotFound(ResponseMessageEnum.AUTH_USER_NOT_FOUND);

    await this.save({
      id: user.id,
      isVerifiedEmail: true
    });

    return user;
  }

  async reSendEmailVerify(user: User): Promise<void> {
    const foundedUser = await this.findOne({email: user.email});
    if(!foundedUser) throw new Unauthorized('User not found');
    const email_verification_link = this.generateEmailVerificationLink(foundedUser);
    await this.mailService.verifyEmail({name: foundedUser.full_name, email: foundedUser.email}, email_verification_link);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.findOne({email});
    if (!user) throw new NotFound(ResponseMessageEnum.AUTH_USER_NOT_FOUND);

    const pin = generatePinSync(6);
    user.credentialsPin = pin;
    user.encryptCredentialsPin();

    await this.mailService.forgotPassword({name: user.full_name, email: user.email}, pin);

    await this.createQueryBuilder().update(User).set({credentialsPin: user.credentialsPin}).where("id = :id", { id: user.id }).execute();
  }

  async resetPassword(email: string, new_password: string, pin: string): Promise<void> {
    const user = await this.findOne({email})
    if (!user) throw new NotFound(ResponseMessageEnum.AUTH_USER_NOT_FOUND)

    if (!user.verifyCredentialsPin(pin)) throw new Unauthorized(ResponseMessageEnum.AUTH_INVALID_PIN)
    user.password = new_password;
    user.encryptPassword();

    await this.createQueryBuilder().update(User).set({password: user.password, credentialsPin: ''}).where("id = :id", { id: user.id }).execute();
  }
 
}
