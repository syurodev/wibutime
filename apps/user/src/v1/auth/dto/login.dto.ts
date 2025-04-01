import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsString()
  @IsNotEmpty()
  deviceType: string;

  @IsString()
  @IsOptional()
  deviceOs?: string;

  @IsString()
  @IsOptional()
  browserInfo?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;
}
