This repository is just a minimal reproduction case.

## Steps to reproduce
- clone me
- `npm i`
- `npm run start:dev`
- an error related to `TypeOrmModule` appears! // should be in the next part

## What's the issue?
This project uses NestJS, dotenv-flow and TypeORM.

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

Everything related to the env is then handled by a config service (`config/config.service.ts`). This service takes an env object as an input (using its constructor and `process.env`), validates the params using Joi and casts them if needed. Using DI, every other piece of this app can access to the current config using this service.

This service is part of the `ConfigModule` which is imported by the `AppModule`.

**This is where my issue comes**.

The `AppModule` also imports the `TypeOrmModule`. This module takes a config object as parameter to setup the DB connection but this object relies on the `ConfigService`.

There are a lot of discussions about this but it seems that it is now possible to use a service in the `@Module` decorator using `forRootAsync()`.

So this is what I did inside `config/database.providers.ts` :

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

If I understand correctly, it should work.
The debug works as expected: the service is injected and my `test` object have the right values.

But those values aren't read by `@nestjs/typeorm`.

I've investigated the issue for a long time but I can't figure out what is going on.
