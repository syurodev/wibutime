import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Column, Entity } from 'typeorm';

@Entity('bookmarks')
export class Bookmark extends TypeOrmBaseEntity {
    @Column({ name: 'user_id', type: 'int', nullable: false })
    user_id: number;

    @Column({ name: 'novel_id', type: 'bigint', nullable: false })
    novel_id: number;

    @Column({ name: 'chapter_id', type: 'bigint', nullable: false })
    chapter_id: number;

    @Column({ name: 'line_number', type: 'bigint', nullable: false })
    line_number: number;

    @Column({ name: 'note', type: 'text', nullable: true })
    note: string;
}
