import { config } from 'dotenv';
import { EnvironmentVariable } from '../decorators/enviroment-variable.decorator';

config();

export class Environment {
  @EnvironmentVariable('PORT', '3000')
  public static PORT: string;

  @EnvironmentVariable('FRONTEND_URL')
  public static FRONTEND_URL: string;

  @EnvironmentVariable('JWT_SECRET')
  public static JWT_SECRET: string;

  @EnvironmentVariable('JWT_ACCESS_EXPIRATION_TIME_IN_MINUTES')
  public static JWT_ACCESS_EXPIRATION_TIME_IN_MINUTES: number;

  @EnvironmentVariable('JWT_REFRESH_EXPIRATION_TIME_IN_DAYS')
  public static JWT_REFRESH_EXPIRATION_TIME_IN_DAYS: number;

  @EnvironmentVariable('DB_HOST')
  public static DB_HOST: string;

  @EnvironmentVariable('DB_PORT')
  public static DB_PORT: number;

  @EnvironmentVariable('DB_USER')
  public static DB_USER: string;

  @EnvironmentVariable('DB_PASS')
  public static DB_PASS: string;

  @EnvironmentVariable('DB_NAME')
  public static DB_NAME: string;

  @EnvironmentVariable('REDIS_HOST')
  public static REDIS_HOST: string;

  @EnvironmentVariable('REDIS_PORT')
  public static REDIS_PORT: number;

  @EnvironmentVariable('REDIS_PASS')
  public static REDIS_PASS: string;

  @EnvironmentVariable('MAX_FILE_SIZE')
  public static MAX_FILE_SIZE: number;
}
