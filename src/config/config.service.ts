import * as Joi from '@hapi/joi';
import { DBConfig, EnvConfig, Environment } from "./config.model";

export class ConfigService {
  public env: Environment;
  public port: number;
  public dbConfig: DBConfig;

  constructor(envConfig: EnvConfig) {
    const validatedConfig = this.validateConfig(envConfig);

    this.env = validatedConfig.NODE_ENV as Environment;
    this.port = Number(validatedConfig.PORT);
    this.dbConfig = {
      host: validatedConfig.DB_HOST,
      port: Number(validatedConfig.DB_PORT),
      username: validatedConfig.DB_USERNAME,
      password: validatedConfig.DB_PASSWORD,
      name: validatedConfig.DB_NAME,
    };
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateConfig(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test'])
        .default('development'),
      PORT: Joi.number().default(3000),
      DB_HOST: Joi.string().default('172.21.0.1'),
      DB_PORT: Joi.number().default(3306),
      DB_USERNAME: Joi.string().default('test'),
      DB_PASSWORD: Joi.string().default('test'),
      DB_NAME: Joi.string().default('dumbell_dev'),
    }).options({ stripUnknown: true });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
