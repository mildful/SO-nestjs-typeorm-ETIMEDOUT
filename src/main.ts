import * as dotenv from 'dotenv-flow';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ConfigService } from './config/config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  await app.listen(config.port);
}

bootstrap();
