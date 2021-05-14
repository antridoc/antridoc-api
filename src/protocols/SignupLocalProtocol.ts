import {BodyParams, Inject} from "@tsed/common";
import {BadRequest, Forbidden} from "@tsed/exceptions";
import {OnVerify, Protocol} from "@tsed/passport";
import { Groups } from "@tsed/schema";
import {Strategy} from "passport-local";
import {User} from "../entities/User";
import { PatientRepository } from "../repositories/PatientRepository";
import {UserRepository} from "../repositories/UserRepository";
import { LoginLocalProtocol } from "./LoginLocalProtocol";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify {
  @Inject()
  private userRepository: UserRepository;

  @Inject()
  private loginLocalProtocol: LoginLocalProtocol;

  @Inject()
  private patientRepository: PatientRepository;

  async $onVerify(@BodyParams() @Groups("creation", "credentials") user: User): Promise<boolean | string> {
    const {email} = user;
    const found = await this.userRepository.findOne({email});

    if (found) throw new Forbidden("Email is already registered");

    const newUser = await this.userRepository.createNew(user);
    if (!newUser) throw new BadRequest("Something wrong");

    await this.patientRepository.createFromUser(newUser);
    
    return this.loginLocalProtocol.createJwt(newUser);
  }
}
