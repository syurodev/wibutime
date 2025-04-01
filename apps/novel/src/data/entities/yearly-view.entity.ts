import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'yearly_views' })
export class YearlyView extends TypeOrmBaseEntity {
    @Column({ name: 'novel_id', type: 'bigint', nullable: true })
    novelId: number | null;

    @Column({ name: 'chapter_id', type: 'bigint', nullable: true })
    chapterId: number | null;

    @Column({ type: 'int', default: 0 })
    views: number;

    @Index()
    @Column({ name: 'viewed_at', type: 'bigint', default: 0 })
    viewedAt: number;
}
