import { Column, Entity } from 'typeorm';

import { TypeOrmBaseEntity } from './base.entity';

@Entity({ name: 'role_permissions' })
export class RolePermission extends TypeOrmBaseEntity {
  @Column({ name: 'role_id', nullable: false, type: 'int' })
  role_id: number;

  @Column({ name: 'permission_id', nullable: false, type: 'int' })
  permission_id: number;
}
