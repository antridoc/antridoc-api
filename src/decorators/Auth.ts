import { UseBeforeEach } from "@tsed/common";
import {StoreSet, useDecorators} from "@tsed/core";
import {Authorize} from "@tsed/passport";
import {In, Security} from "@tsed/schema";
import { RolesEnum } from "../enums/RolesEnum";
import { UserRoleMiddleware } from "../middlewares/UserRoleMiddleware";

export function Auth(): MethodDecorator {
  return useDecorators(
    Authorize("jwt"), Security("bearerAuth"), In("header").Name("Authorize"),
  );
}
