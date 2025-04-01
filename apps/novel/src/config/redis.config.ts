import {
    RedisModuleOptions,
    RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
    async createRedisModuleOptions(): Promise<RedisModuleOptions> {
        return {
            type: 'single',
            url: `redis://:${process.env.CONFIG_REDIS_PASSWORD}@${process.env.CONFIG_REDIS_HOST}:${process.env.CONFIG_REDIS_PORT}`,
            options: {
                stringNumbers: true,
                keepAlive: 10000,
                db: 0,
                reconnectOnError(err: Error) {
                    // Xử lý reconnect khi lỗi xảy ra
                    const targetErrors = [
                        'READONLY',
                        'ECONNRESET',
                        'ECONNREFUSED',
                    ];
                    for (const targetError of targetErrors) {
                        if (err.message.includes(targetError)) {
                            console.warn(
                                'Redis error detected, attempting to reconnect:',
                                err.message,
                            );
                            return true; // Cho phép reconnect
                        }
                    }
                    return false; // Không reconnect cho các lỗi khác
                },
                retryStrategy(times: number) {
                    const delay = Math.min(times * 100, 3000); // Thời gian chờ trước khi retry (tăng dần nhưng không quá 3 giây)
                    console.warn(
                        `Retrying Redis connection in ${delay} ms (attempt ${times})`,
                    );
                    return delay;
                },
            },
        };
    }
}
