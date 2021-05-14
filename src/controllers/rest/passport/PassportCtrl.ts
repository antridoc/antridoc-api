import {BodyParams, Controller, Get, Inject, Post, Put, QueryParams, Req, Res} from "@tsed/common";
import { BadRequest, Unauthorized } from "@tsed/exceptions";
import { deserialize } from "@tsed/json-mapper";
import {Authenticate, Authorize} from "@tsed/passport";
import {Email, Example, Groups, Name, object, Required, Returns, string, Summary} from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import AppConfig from "../../../config/AppConfig";
import {Auth} from "../../../decorators/Auth";
import {Credentials, User} from "../../../entities/User";
import "../../../interfaces";
import { UserRepository } from "../../../repositories/UserRepository";
import { ResponsePayload } from "../../../utilities/WrapperResponseFilter";

@Controller("/auth")
@Name("Auth")
@Docs('REST','APP')
export class PassportCtrl {

  @Inject()
  private userRepository: UserRepository;

  @Post("/login")
  @Authenticate("login", {failWithError: false})
  @(Returns(400).Description("Validation error"))
  login(@Req("user") jwt: string, @BodyParams() @Groups("credentials") credentials: Credentials): ResponsePayload<any> {
    return new ResponsePayload({
      data: {
        bearer_format: "Bearer",
        access_token: jwt
      }
    });
  }

  @Post("/signup")
  @Authenticate("signup")
  signup(@Req("user") jwt: string, @BodyParams() @Groups("creation", "credentials") user: User): ResponsePayload<any> {
    return new ResponsePayload({
      data: {
        bearer_format: "Bearer",
        access_token: jwt
      }
    });
  }

  @Get("/my-profile")
  @Auth()
  getUserInfo(@Req() req: Req): ResponsePayload<User> {
    return new ResponsePayload({
      data: deserialize(req.user, {type: User, groups: ['details']})
    })
  }

  @Get("/logout")
  logout(@Req() req: Express.Request): void {
    req.logout();
  }

  @Get('/verify-email')
  @Summary('Verify Email')
  async verifyEmail(@QueryParams('token') @Required() token: string, @Res() res: Res) {
      await this.userRepository.verifyEmailToken(token)
      return res.redirect(AppConfig.WEB_HOOK_EMAIL_VERIFY)
  }

  @Get('/resend-verify-email')
  @Summary('Resend Email Verification')
  @Auth()
  async resendVerifyEmail( 
      @Req() req: Req, 
      @Res() res: Res
  ): Promise<ResponsePayload<any>> {
      await this.userRepository.reSendEmailVerify(req.user)
      return new ResponsePayload({data: null})
  }

  @Put('/my-profile')
  @Summary('Update My Profile')
  @Auth()
  async updateUserProfile(
      @Req() req: Req,
      @Required() @BodyParams() @Groups('update') payload: User, 
      @Res() res: Res
  ): Promise<ResponsePayload<User>> {
      const updateUser = await this.userRepository.updateProfile(req.user.email, payload)
      return new ResponsePayload({
        data: deserialize(updateUser, {type: User, groups: ['details']})
      })
  }

  @Get('/forgot-password')
  async forgotPassword(@Req() req: Req, @QueryParams('email') @Required() @Email() email:string): Promise<ResponsePayload<any>> {
    await this.userRepository.forgotPassword(email);
    return new ResponsePayload({data: null});
  }

  @Post('/reset-password')
  async resetPassword(
    @BodyParams('email') @Required() @Email() email: string,
    @BodyParams('new_password') @Required() @Example('password') new_password: string,   
    @BodyParams('pin') @Required() @Example('132453') pin: string  
  ): Promise<ResponsePayload<any>> {
    await this.userRepository.resetPassword(email, new_password, pin)
    return new ResponsePayload({data: {}})
  }
  

  // @Get("/connect/:protocol")
  // @Authorize(":protocol")
  // @(Returns(200, User).Groups("details"))
  // connectProtocol(@Req() req: Req): User {
  //   // FACADE
  //   return req.user;
  // }

  // @Get("/connect/:protocol/callback")
  // @Authorize(":protocol")
  // @(Returns(200, User).Groups("details"))
  // connectProtocolCallback(@Req() req: Req): User {
  //   // FACADE
  //   return req.user;
  // }
}
