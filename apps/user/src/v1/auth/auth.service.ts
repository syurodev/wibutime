import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  ExceptionResponseDetail,
  MessageCode,
  MessageCodeDescription,
  PasswordUtil,
} from '@workspace/commons';
import { Session } from '@workspace/types';
import { UserRoleAndPermission } from 'src/common/interfaces/user';
import { UserDevice } from 'src/data/entities/user-device.entity';
import { User } from 'src/data/entities/user.entity';
import { UserDeviceRepository } from 'src/data/repositories/user-device.repository';
import { UserRepository } from 'src/data/repositories/user.repository';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly userDeviceRepository: UserDeviceRepository,
  ) {}

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne([
      { username: username },
      { email: email },
    ]);

    if (existingUser) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          MessageCodeDescription[MessageCode.USERNAME_OR_EMAIL_EXISTS],
          MessageCode.USERNAME_OR_EMAIL_EXISTS,
        ),
        HttpStatus.OK,
      );
    }

    const hashedPassword = await PasswordUtil.hash(password);

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.is_change_password = 1;

    return await this.userRepository.save(user);
  }

  async login(
    username: string,
    password: string,
    deviceInfo: {
      deviceId: string;
      deviceName: string;
      deviceType: string;
      deviceOs?: string;
      browserInfo?: string;
      ipAddress?: string;
    },
  ): Promise<Session> {
    const user: UserRoleAndPermission =
      await this.userRepository.spGetUserRoleAndPermissionByUsername(username);

    if (!user) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          MessageCodeDescription[MessageCode.USER_NOT_FOUND],
          MessageCode.USER_NOT_FOUND,
        ),
        HttpStatus.OK,
      );
    }

    const isPasswordValid = await PasswordUtil.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          MessageCodeDescription[MessageCode.USERNAME_OR_PASSWORD_INVALID],
          MessageCode.USERNAME_OR_PASSWORD_INVALID,
        ),
        HttpStatus.OK,
      );
    }

    if (user.is_block) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          MessageCodeDescription[MessageCode.ACCOUNT_LOCKED],
          MessageCode.ACCOUNT_LOCKED,
        ),
        HttpStatus.OK,
      );
    }

    const payload = {
      sub: user.id,
      username: user.username,
      device_id: deviceInfo.deviceId,
    };

    const token = this.jwtService.sign(payload);

    // Save or update device information
    let userDevice = await this.userDeviceRepository.findOne({
      user_id: user.id,
      device_id: deviceInfo.deviceId,
    });

    if (userDevice) {
      userDevice.token = token;
      userDevice.last_login_at = new Date();
      userDevice.is_active = 1;
      userDevice.device_os = deviceInfo.deviceOs ?? userDevice.device_os;
      userDevice.browser_info =
        deviceInfo.browserInfo ?? userDevice.browser_info;
      userDevice.ip_address = deviceInfo.ipAddress ?? userDevice.ip_address;
    } else {
      userDevice = new UserDevice();
      userDevice.user_id = user.id;
      userDevice.device_id = deviceInfo.deviceId;
      userDevice.device_name = deviceInfo.deviceName;
      userDevice.device_type = deviceInfo.deviceType;
      userDevice.device_os = deviceInfo.deviceOs;
      userDevice.browser_info = deviceInfo.browserInfo;
      userDevice.ip_address = deviceInfo.ipAddress;
      userDevice.token = token;
      userDevice.last_login_at = new Date();
      userDevice.is_trusted = 0; // Thiết bị mới mặc định chưa tin cậy
    }

    await this.userDeviceRepository.save(userDevice);

    // Store token and user info in Redis
    await this.redisService.setAccessToken(user.id, token, {
      ...payload,
      permissions: user.permissions,
      roles: user.roles,
      device_info: {
        device_id: deviceInfo.deviceId,
        device_name: deviceInfo.deviceName,
        device_type: deviceInfo.deviceType,
        device_os: deviceInfo.deviceOs,
        ip_address: deviceInfo.ipAddress,
      },
    });

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      roles: user.roles,
      permissions: user.permissions,
      access_token: token,
      refresh_token: token,
    };
  }

  async validateToken(token: string): Promise<Session> {
    try {
      const decoded: {
        sub: number;
        username: string;
        device_id: string;
      } = this.jwtService.verify(token);

      // Check token in Redis first
      const cachedToken = await this.redisService.getAccessTokenPayload(
        decoded.sub,
        token,
      );

      if (!cachedToken) {
        throw new HttpException(
          new ExceptionResponseDetail(
            HttpStatus.UNAUTHORIZED,
            MessageCodeDescription[MessageCode.INVALID_TOKEN],
            MessageCode.INVALID_TOKEN,
          ),
          HttpStatus.OK,
        );
      }

      // Check if the device is still active
      const userDevice = await this.userDeviceRepository.findOne({
        user_id: decoded.sub,
        device_id: decoded.device_id,
      });

      if (!userDevice || !userDevice.is_active || userDevice.token !== token) {
        // Remove invalid token from Redis
        await this.redisService.removeAccessToken(decoded.sub);
        throw new HttpException(
          new ExceptionResponseDetail(
            HttpStatus.UNAUTHORIZED,
            MessageCodeDescription[MessageCode.INVALID_TOKEN],
            MessageCode.INVALID_TOKEN,
          ),
          HttpStatus.OK,
        );
      }

      return cachedToken;
    } catch (error) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.UNAUTHORIZED,
          MessageCodeDescription[MessageCode.INVALID_TOKEN],
          MessageCode.INVALID_TOKEN,
        ),
        HttpStatus.OK,
      );
    }
  }

  async logout(deviceId: string): Promise<void> {
    const userDevice = await this.userDeviceRepository.findOne({
      device_id: deviceId,
    });
    if (userDevice) {
      userDevice.is_active = 0;
      await this.userDeviceRepository.save(userDevice);
      // Remove token from Redis
      await this.redisService.removeAccessToken(userDevice.user_id);
    }
  }

  async logoutAllDevices(userId: number): Promise<void> {
    const userDevices = await this.userDeviceRepository.find({
      user_id: userId,
    });
    for (const device of userDevices) {
      device.is_active = 0;
      await this.userDeviceRepository.save(device);
    }
    // Remove all tokens for this user from Redis
    await this.redisService.removeAccessToken(userId);
  }

  private generateToken(
    userId: number,
    username: string,
    deviceId: string,
  ): string {
    const payload = {
      sub: userId,
      username: username,
      deviceId: deviceId,
      iat: Math.floor(Date.now() / 1000),
    };
    return this.jwtService.sign(payload);
  }

  private async validateUserCredentials(
    user: UserRoleAndPermission,
    password: string,
  ): Promise<void> {
    if (!user) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          MessageCodeDescription[MessageCode.USER_NOT_FOUND],
          MessageCode.USER_NOT_FOUND,
        ),
        HttpStatus.OK,
      );
    }

    const isPasswordValid = await PasswordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          MessageCodeDescription[MessageCode.USERNAME_OR_PASSWORD_INVALID],
          MessageCode.USERNAME_OR_PASSWORD_INVALID,
        ),
        HttpStatus.OK,
      );
    }

    if (user.is_block) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          MessageCodeDescription[MessageCode.ACCOUNT_LOCKED],
          MessageCode.ACCOUNT_LOCKED,
        ),
        HttpStatus.OK,
      );
    }
  }

  // Đánh dấu thiết bị là đáng tin cậy
  async trustDevice(userId: number, deviceId: string): Promise<void> {
    const userDevice = await this.userDeviceRepository.findOne({
      user_id: userId,
      device_id: deviceId,
    });

    if (!userDevice) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          'Device not found',
          MessageCode.NOT_FOUND,
        ),
        HttpStatus.OK,
      );
    }

    userDevice.is_trusted = 1;
    await this.userDeviceRepository.save(userDevice);
  }

  // Thu hồi quyền truy cập của thiết bị
  async revokeDevice(userId: number, deviceId: string): Promise<void> {
    const userDevice = await this.userDeviceRepository.findOne({
      user_id: userId,
      device_id: deviceId,
    });

    if (!userDevice) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          'Device not found',
          MessageCode.NOT_FOUND,
        ),
        HttpStatus.OK,
      );
    }

    userDevice.is_active = 0;
    await this.userDeviceRepository.save(userDevice);

    // Xóa token khỏi Redis
    await this.redisService.removeSpecificAccessToken(userId, userDevice.token);
  }

  // Lấy danh sách thiết bị của người dùng
  async getUserDevices(userId: number): Promise<any[]> {
    const devices = await this.userDeviceRepository.find({
      user_id: userId,
    });

    return devices.map((device) => ({
      id: device.id,
      device_id: device.device_id,
      device_name: device.device_name,
      device_type: device.device_type,
      device_os: device.device_os,
      ip_address: device.ip_address,
      is_active: device.is_active === 1,
      is_trusted: device.is_trusted === 1,
      last_login_at: device.last_login_at,
    }));
  }
}
