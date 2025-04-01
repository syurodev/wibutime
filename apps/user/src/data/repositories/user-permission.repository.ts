import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserPermissionRepository extends BaseRepository<UserPermission> {
  constructor(
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {
    super(userPermissionRepository);
  }
}
