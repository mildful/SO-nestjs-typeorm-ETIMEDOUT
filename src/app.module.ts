import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import databaseProviders from "./config/database.providers";
import { AppController } from './app.controller';

@Module({
  imports: [
    ...databaseProviders,
    ConfigModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
