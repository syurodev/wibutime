import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Column, Entity } from 'typeorm';

@Entity('chapters')
export class Chapter extends TypeOrmBaseEntity {
    @Column({ name: 'user_id', type: 'int', default: 0 })
    user_id: number;

    @Column({ name: 'novel_id', type: 'int', default: 0 })
    novel_id: number;

    @Column({ name: 'volume_id', type: 'int', default: 0 })
    volume_id: number;

    @Column({ name: 'views', type: 'bigint', default: 0 })
    views: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'smallint', default: 0 })
    status: number;

    @Column({ type: 'int', default: 0 })
    index: number;

    @Column({ type: 'jsonb', default: [] })
    content: Array<{
        id: string;
        type: string;
        url?: string;
        children: Array<{
            text: string;
            italic?: boolean;
            bold?: boolean;
        }>;
    }>;

    @Column({ name: 'word_count', type: 'int', default: 0 })
    word_count: number;
}
