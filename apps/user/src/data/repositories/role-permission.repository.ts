import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from '../entities/role-permission.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class RolePermissionRepository extends BaseRepository<RolePermission> {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {
    super(rolePermissionRepository);
  }
}
