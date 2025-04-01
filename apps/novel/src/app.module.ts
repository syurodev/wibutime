import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisClientModule } from '@syurodev/nestjs-common';
import { CronModule } from './cron/cron.module';
import { DataModule } from './data/data.module';
import { PublicModule } from './public/public.module';
import { AppV1Module } from './v1/app.v1.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // GrpcModule,
    DataModule,
    RedisClientModule.forRoot({
      host: process.env.CONFIG_REDIS_HOST,
      port: +process.env.CONFIG_REDIS_PORT,
      password: process.env.CONFIG_REDIS_PASSWORD,
      database: +process.env.CONFIG_REDIS_DB,
    }),
    AppV1Module,
    PublicModule,
    CronModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
