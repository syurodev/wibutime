import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Entity, Column, Index } from 'typeorm';

@Entity({ name: 'volume_chapter_maps' })
export class VolumeChapterMap extends TypeOrmBaseEntity {
  @Column({ name: 'volume_id', type: 'int', nullable: false })
  @Index()
  volume_id: number;

  @Column({ name: 'chapter_id', type: 'int', nullable: false })
  chapter_id: number;
}
