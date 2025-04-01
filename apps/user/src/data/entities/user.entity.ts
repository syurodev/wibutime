import { Column, Entity, Index } from 'typeorm';

import { EditorContent } from 'src/common/interfaces/editor';
import { TypeOrmBaseEntity } from './base.entity';

@Entity({ name: 'users' })
export class User extends TypeOrmBaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 50, nullable: false, default: '' })
  username: string;

  @Column({ type: 'varchar', nullable: false, default: '' })
  password: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  email: string;

  @Column({ type: 'varchar', nullable: false, default: '' })
  avatar: string;

  @Column({ type: 'jsonb', default: '[]' })
  bio: EditorContent[];

  @Column({ type: 'smallint', default: 0, name: 'is_change_password' })
  is_change_password: number;

  @Column({ type: 'smallint', default: 0, name: 'is_verify_email' })
  is_verify_email: number;

  @Column({ type: 'smallint', default: 0, name: 'is_block' })
  is_block: number;
}
