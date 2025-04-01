import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'lightnovel_volume_maps' })
export class LightnovelVolumeMap extends TypeOrmBaseEntity {
  @Column({ name: 'novel_id', type: 'int', nullable: false })
  novel_id: number;

  @Column({ name: 'volume_id', type: 'int', nullable: false })
  volume_id: number;
}
