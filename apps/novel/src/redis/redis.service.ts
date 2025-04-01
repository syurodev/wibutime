import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_KEY } from './key';

@Injectable()
export class RedisService {
    constructor(
        @InjectRedis()
        private readonly redis: Redis,
    ) {}

    async getAccessToken(userId: number) {
        const key: string = REDIS_KEY.ACCESS_TOKEN(userId, '*');
        const token: string = (await this.redis.keys(key))[0].split(':').pop();

        return token;
    }

    async setAccessToken(
        userId: number,
        token: string,
        payload: any,
        expiresIn: number = 365 * 86400, // 365 ngày
    ) {
        const key = REDIS_KEY.ACCESS_TOKEN(userId, token);
        await this.redis.set(key, JSON.stringify(payload), 'EX', expiresIn);
    }

    async existsAccessToken(token: string) {
        const exists = await this.redis.keys(
            REDIS_KEY.ACCESS_TOKEN('*', token),
        );

        return !!exists[0];
    }

    async hasUserAccessToken(userId: number) {
        const [keyAccessToken] = await this.redis.keys(
            REDIS_KEY.ACCESS_TOKEN(userId, '*'),
        );

        return keyAccessToken?.split(':')?.pop();
    }

    async removeAccessToken(userId: number) {
        const [key] = await this.redis.keys(
            REDIS_KEY.ACCESS_TOKEN(userId, '*'),
        );
        await this.redis.del(key);
    }

    async removeListAccessToken(userIds: number[]) {
        const multi = this.redis.multi();
        for (const userId of userIds) {
            const keys = await this.redis.keys(
                REDIS_KEY.ACCESS_TOKEN(userId, '*'),
            );
            if (keys.length > 0) {
                multi.del(...keys);
            }
        }

        await multi.exec();
    }

    async setCache(
        value: any,
        key: string,
        prefix?: string,
        expiresIn?: number,
    ) {
        await this.redis.set(
            REDIS_KEY.CACHE_KEY(key, prefix),
            JSON.stringify(value),
            'EX',
            expiresIn,
        );
    }

    async getCache<T>(key: string, prefix?: string): Promise<T> {
        const value: string = await this.redis.get(
            REDIS_KEY.CACHE_KEY(key, prefix),
        );
        return value ? JSON.parse(value) : null;
    }

    async removeCache(key: string, prefix?: string) {
        await this.redis.del(REDIS_KEY.CACHE_KEY(key, prefix));
    }

    async removeListCache(keys: string[], prefix?: string) {
        const multi = this.redis.multi();
        for (const key of keys) {
            multi.del(REDIS_KEY.CACHE_KEY(key, prefix));
        }
    }

    async removeListCacheByPrefix(prefix: string) {
        const keys = await this.redis.keys(REDIS_KEY.CACHE_KEY('*', prefix));
        const multi = this.redis.multi();
        for (const key of keys) {
            multi.del(key);
        }
        await multi.exec();
    }
}
