import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';
import { CronModule } from './cron/cron.module';
import { DataModule } from './data/data.module';
import { PublicModule } from './public/public.module';
import { RedisClientModule } from './redis/redis.module';
import { AppV1Module } from './v1/app.v1.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.CONFIG_JWT_SECRET_TOKEN,
      signOptions: { expiresIn: '365d' },
    }),
    // GrpcModule,
    DataModule,
    RedisClientModule,
    AppV1Module,
    PublicModule,
    CronModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
