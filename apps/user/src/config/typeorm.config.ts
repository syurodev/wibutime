import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.CONFIG_PG_HOST_USER,
      port: parseInt(process.env.CONFIG_PG_PORT_USER),
      username: process.env.CONFIG_PG_USERNAME_USER,
      password: process.env.CONFIG_PG_PASSWORD_USER,
      database: process.env.CONFIG_PG_DB_NAME_USER,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
      nativeDriver: false,
    };
  }
}
