import * as dotenv from 'dotenv';
dotenv.config();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

import * as process from 'node:process';
import { AppModule } from './app.module';

const envConfig = dotenv.parse(fs.readFileSync('.env'));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.SERVICE_PORT, '0.0.0.0');

  for (const k in envConfig) {
    if (!k.includes('PASSWORD') && !k.includes('SECRET')) {
      Logger.debug(`${k}=${envConfig[k]}`);
    }
  }
}
bootstrap();
