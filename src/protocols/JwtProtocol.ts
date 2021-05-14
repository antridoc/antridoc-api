import {Req} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import {Arg, OnVerify, Protocol} from "@tsed/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import AppConfig from "../config/AppConfig";
import {User} from "../entities/User";
import {UserRepository} from "../repositories/UserRepository";

@Protocol({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: AppConfig.JWT_SECRET || "thisismysupersecretprivatekey1",
    issuer: AppConfig.JWT_ISSUER || "localhost",
    audience: AppConfig.JWT_AUDIENCE || "localhost"
  }
})
export class JwtProtocol implements OnVerify {
  @Inject()
  userRepository: UserRepository;

  async $onVerify(@Req() req: Express.Request, @Arg(0) jwtPayload: Record<string, unknown>): Promise<User> {
    const user = await this.userRepository.findByID(jwtPayload.sub as string);

    if (!user) {
      throw new Unauthorized("Wrong token");
    }

    req.user = user;

    return user;
  }
}
