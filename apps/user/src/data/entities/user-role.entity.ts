import { Column, Entity } from 'typeorm';

import { TypeOrmBaseEntity } from './base.entity';

@Entity({ name: 'user_roles' })
export class UserRole extends TypeOrmBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: 'int' })
  user_id: number;

  @Column({ name: 'role_id', nullable: false, type: 'int' })
  role_id: number;
}
