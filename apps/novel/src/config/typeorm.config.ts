import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.CONFIG_PG_HOST_NOVEL,
      port: parseInt(process.env.CONFIG_PG_PORT_NOVEL),
      username: process.env.CONFIG_PG_USERNAME_NOVEL,
      password: process.env.CONFIG_PG_PASSWORD_NOVEL,
      database: process.env.CONFIG_PG_DB_NAME_NOVEL,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
    };
  }
}
