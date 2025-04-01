import { Column, Entity } from 'typeorm';

import { MultilingualContent } from 'src/common/interfaces/multilingual';
import { TypeOrmBaseEntity } from './base.entity';

@Entity({ name: 'roles' })
export class Role extends TypeOrmBaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  description: MultilingualContent;

  @Column({ type: 'smallint', default: 0, name: 'is_system' })
  is_system: number;
}
