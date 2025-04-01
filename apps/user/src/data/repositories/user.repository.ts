import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProcedureUtil } from '@workspace/commons';
import { Repository } from 'typeorm';

import { UserRoleAndPermission } from 'src/common/interfaces/user';
import { User } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async spGetUserRoleAndPermissionByUsername(
    username: string,
  ): Promise<UserRoleAndPermission> {
    return new StoreProcedureUtil(
      await this.userRepository.query(
        `CALL sp_g_user_role_and_permission_with_username($1, $2, $3, $4)`,
        [username, null, null, null],
      ),
    ).getResult<UserRoleAndPermission>();
  }
}
