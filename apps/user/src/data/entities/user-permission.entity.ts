import { Column, Entity } from 'typeorm';

import { TypeOrmBaseEntity } from './base.entity';

@Entity({ name: 'user_permissions' })
export class UserPermission extends TypeOrmBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: 'int' })
  user_id: number;

  @Column({ name: 'permission_id', nullable: false, type: 'int' })
  permission_id: number;
}
