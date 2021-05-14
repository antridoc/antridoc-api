import {BodyParams, Constant, Inject} from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import {OnVerify, Protocol} from "@tsed/passport";
import {Groups} from "@tsed/schema";
import * as jwt from "jsonwebtoken";
import {IStrategyOptions, Strategy} from "passport-local";
import {Credentials, User} from "../entities/User";
import {UserRepository} from "../repositories/UserRepository";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class LoginLocalProtocol implements OnVerify {
  @Constant("passport.protocols.jwt.settings")
  jwtSettings: Record<string, string | number>;

  @Inject()
  private userRepository: UserRepository;

  async $onVerify(@BodyParams() @Groups("credentials") credentials: Credentials): Promise<boolean | string> {
    const {email, password} = credentials;
    const user = await this.userRepository.findOne({email});
    
    if (!user) {
      throw new Unauthorized("User not found or wrong password")
    }

    if (!user.verifyPassword(password)) {
      throw new Unauthorized("User not found or wrong password")
    }

    return this.createJwt(user);
  }

  public createJwt(user: User): string {
    const {issuer, audience, secretOrKey, maxAge = 3600} = this.jwtSettings;
    const now = Date.now();

    return jwt.sign(
      {
        iss: issuer,
        aud: audience,
        sub: user.id,
        exp: now + (maxAge as number) * 1000,
        iat: now
      },
      secretOrKey as string
    );
  }
}
