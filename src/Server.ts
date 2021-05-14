import "@tsed/ajv";
import {InjectorService, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/typeorm";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import AppConfig from "./config/AppConfig";
import typeormConfig from "./config/typeorm";
import {User} from "./entities/User";
import {UserRepository} from "./repositories/UserRepository";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json", "multipart/form-data"],
  httpPort: AppConfig.PORT || 3000,
  httpsPort: false, // CHANGE
  mount: {
    "/pages": [`${rootDir}/controllers/pages/**/*.ts`],
    "/app": [`${rootDir}/controllers/app/**/*.ts`],
    "/": [`${rootDir}/controllers/rest/**/*.ts`],
  },
  passport: {
    userInfoModel: User
  },
  componentsScan: [
    `${rootDir}/protocols/**/*.ts`,
    `${rootDir}/utilities/**/*.ts`,
    `${rootDir}/services/**/*.ts`,
  ],
  statics: {
    "/static": [
      {
        root: `${rootDir}/../storage/uploads`,
      }
    ]
  },
  swagger: [
    {
      path: "/api-docs/rest",
      specVersion: "3.0.1",
      doc: 'REST',
      spec: {
        info: {
          title: 'Api Documentations REST',
          version: '1.0.0'
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Call POST /rest/auth/login to get the access token"
            }
          }
        }
      }
    },
    {
      path: "/api-docs/app",
      specVersion: "3.0.1",
      doc: 'APP',
      spec: {
        info: {
          title: 'Api Documentations APP',
          version: '1.0.0'
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Call POST /rest/auth/login to get the access token"
            }
          }
        }
      }
    }
  ],
  typeorm: typeormConfig,
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs"
  },
  exclude: ["**/*.spec.ts"],
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  @Inject()
  injector: InjectorService;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }

  async $onReady(): Promise<void> {
    const repository = this.injector.get<UserRepository>(UserRepository);
    if(!repository) return;
    
    const count = await repository.count({role: 'super_admin'});

    if (!count) {
      const user = repository.create({
        full_name: 'Antridoc Admin',
        email: 'admin@antridoc.com',
        password: 'password',
        role: 'super_admin',
        gender: 'laki-laki'
      })
      await repository.save(user)
    }
  }
}
