import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RedisService } from 'src/redis/redis.service';


@Injectable()
export class CronService {
    constructor(
        private readonly redisService: RedisService,
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async viewedHandler() {
        
    }
}
