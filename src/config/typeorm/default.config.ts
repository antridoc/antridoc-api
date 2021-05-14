import AppConfig from "../AppConfig";

const rootDir = __dirname;
export default {
  name: "default",
  type: "postgres",
  host: AppConfig.DB_HOST || "localhost",
  port: AppConfig.DB_PORT,
  username: AppConfig.DB_USER || "postgres",
  password: AppConfig.DB_PASSWORD || "root",
  database: AppConfig.DB_NAME || "test",
  synchronize: AppConfig.DB_SNCY,
  logging: AppConfig.POSTGRES_LOGIN === "true",
  entities: [`${rootDir}/../../entities/**/*{.ts,.js}`],
  migrations: [`${rootDir}/../../migration/**/*{.ts,.js}`],
  subscribers: [`${rootDir}/../../subscriber/**/*{.ts,.js}`],
};
