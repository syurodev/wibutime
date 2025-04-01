import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Entity, Column, Index } from 'typeorm';

@Entity('genres')
export class Genre extends TypeOrmBaseEntity {
  @Column({ unique: true })
  @Index()
  name: string;

  @Column({ default: '' })
  description: string;
}
