This repository is just a minimal reproduction case.

## Step to reproduce
- clone me
- `npm i`
- `npm run start:dev`
- an error related to `TypeOrmModule` appears!

## What's the issue?
This projet uses NestJS, dotenv-flow and TypeORM.

I would like to have my DB settings inside the `.env` file :

```env
PORT=3000

# here
DB_HOST=172.21.0.1
DB_PORT=3306
DB_USERNAME=test
DB_PASSWORD=test
DB_NAME=dumbell_dev
```

This env is loaded into `process.env` by `dotenv-flow` in `main.ts`

```javascript
import * as dotenv from 'dotenv-flow';
dotenv.config();
```

Everything related to the env is then handled by a config service (`config/config.service.ts`). This service takes an env object as an input (using its constructor and `process.env`), validate the params using Joi and cast them if needed. Using DI, every other pieces of this app can access the current config using this service.

This service is part of the `ConfigModule` which is imported by the `AppModule`.

**And here is my issue**.

The `AppModule` also import the `TypeOrmModule`. This module takes a config object as parameter to setup the DB connection but this object relies on the `ConfigService`.

There is a lot of discussions about this but it seems that it is now possible to use a service in the `@Module` decorator using `forRootAsync()`.

So it's what I've done inside `config/database.providers.ts` :

```typescript
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
        console.log(test);
        return test;
    },
    inject: [ConfigService],
}),
```

If I understand correctly, it should works.
The debug works as expected: the service is injected and my `test` object have the right values.

But those values aren't read by `@nestjs/typeorm`.

I've looked for it for a long time and can't figure out whats going on.
