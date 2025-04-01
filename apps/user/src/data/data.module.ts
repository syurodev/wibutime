import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfigService } from '../config/typeorm.config';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserDevice } from './entities/user-device.entity';
import { UserPermission } from './entities/user-permission.entity';
import { UserRole } from './entities/user-role.entity';
import { User } from './entities/user.entity';
import { PermissionRepository } from './repositories/permission.repository';
import { RolePermissionRepository } from './repositories/role-permission.repository';
import { RoleRepository } from './repositories/role.repository';
import { UserDeviceRepository } from './repositories/user-device.repository';
import { UserPermissionRepository } from './repositories/user-permission.repository';
import { UserRoleRepository } from './repositories/user-role.repository';
import { UserRepository } from './repositories/user.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([
      User,
      Permission,
      RolePermission,
      Role,
      UserDevice,
      UserPermission,
      UserRole,
    ]),
  ],
  providers: [
    UserRepository,
    PermissionRepository,
    RolePermissionRepository,
    RoleRepository,
    UserDeviceRepository,
    UserPermissionRepository,
    UserRoleRepository,
  ],
  exports: [
    UserRepository,
    PermissionRepository,
    RolePermissionRepository,
    RoleRepository,
    UserDeviceRepository,
    UserPermissionRepository,
    UserRoleRepository,
  ],
})
export class DataModule {}
