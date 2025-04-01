import { Injectable } from '@nestjs/common';
import { RedisService } from '@syurodev/nestjs-common';
import { TimeUtil } from '@syurodev/ts-common';
import { Between, EntityManager } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

import { REDIS_KEY_PREFIX } from '../common/constants/redis-key.enum';
import { HourViewRepository } from '../data/repositories/hour-view.repository';
import { HourView } from '../data/entities/hour-view.entity';
import { Chapter } from '../data/entities/chapter.entity';
import { DailyViewRepository } from '../data/repositories/daily-view.repository';
import { DailyView } from '../data/entities/daily-view.entity';

@Injectable()
export class CronService {
    constructor(
        private readonly redisService: RedisService,
        private readonly hourViewRepository: HourViewRepository,
        private readonly dailyViewRepository: DailyViewRepository,
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async viewedHandler() {
        const currentHour = new Date().getHours() - 1; // Lấy giờ hiện tại (trừ 1 vì cần lấy giờ trước đó)
        const pattern = `${REDIS_KEY_PREFIX.VIEWED}:*:*:${currentHour}`; // Tạo pattern để tìm các key Redis theo giờ
        const keys = await this.scanKeys(pattern); // Tìm tất cả các keys Redis khớp với pattern

        const viewCounts: Map<
            string,
            { novelId: number; chapterId: number; views: number }
        > = new Map();
        const viewedAt = new TimeUtil(new Date()).convertToUnix() - 3600; // Lấy thời gian 1 giờ trước tính bằng Unix timestamp

        const batchSize = 500; // Kích thước batch khi xử lý Redis

        // Sử dụng pipeline để thực hiện các lệnh Redis và lấy dữ liệu
        const pipeline = this.redisService.client.pipeline();
        for (let i = 0; i < keys.length; i++) {
            pipeline.hgetall(keys[i]); // Lấy tất cả các field-value từ Redis hash
            pipeline.del(keys[i]); // Xóa key khỏi Redis sau khi lấy dữ liệu
            // Nếu đủ batchSize hoặc là key cuối cùng, thực hiện các lệnh Redis
            if ((i + 1) % batchSize === 0 || i === keys.length - 1) {
                const results = await pipeline.exec(); // Thực thi pipeline và lấy kết quả
                this.processResults(results, viewCounts, keys); // Xử lý kết quả và cập nhật dữ liệu vào viewCounts
                pipeline.reset(); // Đặt lại pipeline để tiếp tục với các lệnh tiếp theo
            }
        }

        // Lưu vào cơ sở dữ liệu và cập nhật lượt xem cho các chương trong một transaction
        const recordsToSave: HourView[] = []; // Mảng để lưu các bản ghi HourView
        const chapterIncrements: Map<number, number> = new Map(); // Mảng để lưu số lượt xem cần tăng cho từng chapter

        // Xử lý dữ liệu từ Redis và chuẩn bị các bản ghi HourView
        viewCounts.forEach(({ novelId, chapterId, views }) => {
            const hourView = new HourView();
            hourView.novelId = novelId; // Gán novelId
            hourView.chapterId = chapterId; // Gán chapterId
            hourView.views = views; // Gán số lượt xem
            hourView.viewedAt = viewedAt; // Gán thời gian đã xem
            recordsToSave.push(hourView); // Thêm bản ghi vào mảng

            // Cộng dồn số lượt xem cho mỗi chương (chapter)
            if (!chapterIncrements.has(chapterId)) {
                chapterIncrements.set(chapterId, 0); // Khởi tạo nếu chưa có
            }
            chapterIncrements.set(
                chapterId,
                chapterIncrements.get(chapterId)! + views,
            ); // Cộng dồn lượt xem
        });

        // Bắt đầu transaction để lưu dữ liệu và cập nhật lượt xem chương
        await this.hourViewRepository
            .manager()
            .transaction(async (manager: EntityManager) => {
                // Lưu các bản ghi HourView vào cơ sở dữ liệu qua transaction
                await this.saveToDatabase(recordsToSave, manager);

                // Cập nhật lượt xem cho các chương trong transaction
                await this.incrementChapterViews(chapterIncrements, manager);
            });
    }

    @Cron('59 23 * * *') //Chạy cuối ngày
    async dailyViewedHandler() {
        const date = new TimeUtil(new Date());
        const hourViews: HourView[] = await this.hourViewRepository.find({
            viewedAt: Between(date.getStartOfDayUnix(), date.getEndOfDayUnix()),
        });

        const aggregateViews = this.aggregateViewsByChapter(hourViews);

        for (const x of aggregateViews) {
            const dailyViewed: DailyView = new DailyView();
            dailyViewed.novelId = x.novelId;
            dailyViewed.chapterId = x.chapterId;
            dailyViewed.views = x.views;
            dailyViewed.viewedAt = date.getStartOfDayUnix();

            await this.dailyViewRepository.save(dailyViewed);
        }
    }

    private processResults(
        results: any[],
        viewCounts: Map<
            string,
            { novelId: number; chapterId: number; views: number }
        >,
        keys: string[],
    ) {
        results.forEach(([err, result], index) => {
            if (err) return; // Bỏ qua nếu có lỗi trong việc lấy dữ liệu

            const key = keys[index]; // Lấy key Redis

            const match = new RegExp(
                `${REDIS_KEY_PREFIX.VIEWED}:(\\d+):(\\d+):\\d+`,
            ).exec(key); // Sử dụng RegExp với biến
            // Tách novelId và chapterId từ key
            if (!match) return; // Bỏ qua nếu không khớp pattern

            const novelId = parseInt(match[1]); // Lấy novelId

            // Kiểm tra nếu result là một object hợp lệ
            if (typeof result === 'object' && result !== null) {
                // result là một object hợp lệ, xử lý các lượt xem của các chapter
                Object.entries(result).forEach(
                    ([chapterIdStr, countStr]: [string, string]) => {
                        const chapterId = parseInt(chapterIdStr); // Lấy chapterId
                        const count = parseInt(countStr); // Lấy số lượt xem
                        const key = `${novelId}:${chapterId}`;

                        if (!viewCounts.has(key)) {
                            viewCounts.set(key, {
                                novelId,
                                chapterId,
                                views: 0,
                            }); // Khởi tạo nếu chưa có
                        }
                        viewCounts.get(key)!.views += count; // Cộng dồn số lượt xem
                    },
                );
            }
        });
    }

    // Hàm lưu các bản ghi HourView vào cơ sở dữ liệu theo batch trong transaction
    private async saveToDatabase(
        recordsToSave: HourView[],
        manager: EntityManager,
    ) {
        const batchSize = 1000; // Kích thước batch khi lưu vào cơ sở dữ liệu
        for (let i = 0; i < recordsToSave.length; i += batchSize) {
            const batch = recordsToSave.slice(i, i + batchSize); // Lấy một batch dữ liệu
            await manager.save(HourView, batch); // Lưu batch vào cơ sở dữ liệu qua transaction
        }
    }

    // Hàm cập nhật lượt xem cho các chương trong transaction
    private async incrementChapterViews(
        chapterIncrements: Map<number, number>,
        manager: EntityManager,
    ) {
        const incrementPromises = []; // Mảng chứa các promise để thực hiện đồng thời các thao tác increment
        for (const [chapterId, views] of chapterIncrements.entries()) {
            incrementPromises.push(
                manager.increment(Chapter, { id: chapterId }, 'viewed', views), // Thực hiện increment lượt xem cho mỗi chapter
            );
        }

        // Thực thi các thao tác increment đồng thời
        await Promise.all(incrementPromises); // Đảm bảo tất cả các thao tác đều được thực thi đồng thời
    }

    async scanKeys(pattern: string): Promise<string[]> {
        const keys: string[] = [];
        let cursor = '0';

        do {
            const [nextCursor, partialKeys] =
                await this.redisService.client.scan(
                    cursor,
                    'MATCH',
                    pattern,
                    'COUNT',
                    1000,
                );
            cursor = nextCursor;
            keys.push(...partialKeys);
        } while (cursor !== '0');

        return keys;
    }

    aggregateViewsByChapter(data: HourView[]) {
        const aggregated = new Map<
            string,
            Partial<{
                novelId: number;
                chapterId: number;
                views: number;
                viewedAt: number;
            }>
        >();

        for (const item of data) {
            const chapterKey = item.chapterId;

            if (aggregated.has(chapterKey.toString())) {
                const existing = aggregated.get(chapterKey.toString())!;

                // Cộng dồn views
                existing.views! += item.views;
            } else {
                // Nếu chưa tồn tại chapterId, thêm mới vào map, giữ novelId thay vì id
                aggregated.set(chapterKey.toString(), {
                    novelId: item.novelId,
                    chapterId: item.chapterId,
                    views: item.views,
                    viewedAt: item.viewedAt,
                });
            }
        }

        // Trả về mảng các giá trị đã gộp
        return Array.from(aggregated.values());
    }
}
