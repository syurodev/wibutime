import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Column, Entity, Index } from 'typeorm';

@Entity('reading_histories')
@Index('idx_reading_history_user_novel', ['user_id', 'novel_id'])
export class ReadingHistory extends TypeOrmBaseEntity {
  @Column({ name: 'user_id', type: 'int', nullable: false })
  user_id: number;

  @Column({ name: 'novel_id', type: 'bigint', nullable: false })
  novel_id: number;

  @Column({ name: 'chapter_id', type: 'bigint', nullable: false })
  chapter_id: number;

  @Column({
    name: 'status',
    type: 'smallint',
    nullable: false,
    default: 2,
    comment: '2: Đã hoàn thành, 1: Đang đọc',
  })
  status: number;

  @Column({
    name: 'bookmark_line',
    type: 'varchar',
    nullable: false,
    default: '',
    comment: 'Dòng đã đọc để phục vụ chức năng bookmark',
  })
  bookmark_line: string;

  @Column({
    name: 'last_read_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_read_at: Date; // Thời gian đọc gần nhất
}
