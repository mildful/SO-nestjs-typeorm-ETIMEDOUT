import {TypeOrmModule} from "@nestjs/typeorm";
import {ConnectionOptions} from "typeorm";
import {ConfigModule} from "./config.module";
import {ConfigService} from "./config.service";
import * as path from "path";

export default [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
            const test = {
                type: 'mysql',
                synchronize: true,
                logging: false,
                host: configService.dbConfig.host,
                port: configService.dbConfig.port,
                username: configService.dbConfig.username,
                password: configService.dbConfig.password,
                database: configService.dbConfig.name,
                entities: [ path.join(__dirname, '../..', 'src/**/*.entity.ts').toString() ],
            } as ConnectionOptions;
            // debug here
            return test;
        },
        inject: [ConfigService],
    }),
];
