import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Entity, Column } from 'typeorm';

@Entity('authors')
export class Author extends TypeOrmBaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', default: '' })
  bio: string;
}
