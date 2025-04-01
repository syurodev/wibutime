import { Entity, Column } from 'typeorm';

import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';

@Entity('volumes')
export class Volume extends TypeOrmBaseEntity {
  @Column({ name: 'user_id', type: 'int' })
  user_id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ name: 'volume_number', default: 0 })
  volume_number: number;

  @Column({ name: 'cover_image', default: '' })
  cover_image: string;

  @Column({ name: 'release_date', type: 'timestamp', nullable: true })
  release_date: Date;

  @Column({ type: 'text', nullable: true })
  synopsis: string;

  @Column({ name: 'lightnovel_id', type: 'int' })
  lightnovel_id: number;
}
