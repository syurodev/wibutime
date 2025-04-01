import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserDevice } from '../entities/user-device.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserDeviceRepository extends BaseRepository<UserDevice> {
  constructor(
    @InjectRepository(UserDevice)
    private readonly userDeviceRepository: Repository<UserDevice>,
  ) {
    super(userDeviceRepository);
  }

  async deactivateDevice(deviceId: string): Promise<void> {
    await this.userDeviceRepository.update(
      { device_id: deviceId },
      { is_active: 0 },
    );
  }

  async deactivateAllUserDevices(userId: number): Promise<void> {
    await this.userDeviceRepository.update(
      { user_id: userId },
      { is_active: 0 },
    );
  }
}
