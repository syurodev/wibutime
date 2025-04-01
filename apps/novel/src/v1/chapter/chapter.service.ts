import { Injectable } from '@nestjs/common';
import { RedisService } from '@syurodev/nestjs-common';
import { FindOptionsWhere } from 'typeorm';

import { ChapterRepository } from '../../data/repositories/chapter.repository';
import { Chapter } from '../../data/entities/chapter.entity';
import { REDIS_KEY_PREFIX } from '../../common/constants/redis-key.enum';

@Injectable()
export class ChapterService {
    constructor(
        private chapterRepository: ChapterRepository,
        private readonly redisService: RedisService,
    ) {}

    async getDetail(id: number) {
        const option: FindOptionsWhere<Chapter> = {
            id: id,
        };
        return await this.chapterRepository.findOne(option);
    }

    async viewed(id: number, novelId: number) {
        await this.redisService.client.hincrby(
            `${REDIS_KEY_PREFIX.VIEWED}:${novelId}:${id}:${new Date().getHours()}`,
            id.toString(),
            1,
        );
    }
}
