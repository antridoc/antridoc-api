import AppConfig from "../AppConfig";

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
  entities: ["${rootDir}/entities/**/*.ts"],
  migrations: ["${rootDir}/migration/**/*.ts"],
  subscribers: ["${rootDir}/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "${rootDir}/entity",
    migrationsDir: "${rootDir}/migration",
    subscribersDir: "${rootDir}/subscriber"
  }
};
