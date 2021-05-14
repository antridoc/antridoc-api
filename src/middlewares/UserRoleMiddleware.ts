import { EndpointInfo, IMiddleware, Middleware, Req } from "@tsed/common";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import { User } from "../entities/User";
import { ResponseMessageEnum } from "../enums/ResponseMessageEnum";

@Middleware()
export class UserRoleMiddleware implements IMiddleware {
    use(@Req('user') user: User, @EndpointInfo() endpoint: EndpointInfo) {
        const options = endpoint.get(UserRoleMiddleware) || {}
        if ( !options.alloweddRoles.includes(user.role)) throw new  Forbidden('user not allowed')
    }
}