import { Global, Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

import { RedisConfigService } from '../config/redis.config';
import { RedisService } from './redis.service';

@Global()
@Module({
    imports: [RedisModule.forRootAsync({ useClass: RedisConfigService })],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisClientModule {}
