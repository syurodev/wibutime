import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'lightnovel_genre_maps' })
export class LightnovelGenreMap extends TypeOrmBaseEntity {
  @Column({ name: 'novel_id', type: 'int', nullable: false })
  novel_id: number;

  @Column({ name: 'genre_id', type: 'int', nullable: false })
  genre_id: number;
}
