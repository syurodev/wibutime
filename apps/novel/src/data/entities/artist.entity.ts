import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Entity, Column, Index } from 'typeorm';

@Entity({ name: 'artists' })
export class Artist extends TypeOrmBaseEntity {
  @Index()
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', default: '' })
  bio: string;
}
