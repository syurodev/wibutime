import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import * as os from 'os';

import {
  HttpException,
  HttpStatus,
  Logger,
  LogLevel,
  ValidationPipe,
} from '@nestjs/common';
import { ExceptionResponseDetail, MessageCode } from '@workspace/commons';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';
import { grpcServerOptions } from './grpc/server/server.config';

const envConfig = dotenv.parse(fs.readFileSync('.env'));

const SERVICE_NAME: string = process.env.npm_package_name;
const PREFIX = 'api';
const DEFAULT_LOGGER_LEVELS: LogLevel[] = ['log', 'error', 'warn', 'debug'];
const loggerLevels: LogLevel[] =
  process.env.CONFIG_LOGGER_LEVEL?.split(',').filter(
    (level): level is LogLevel =>
      ['log', 'error', 'warn', 'debug', 'verbose'].includes(level as LogLevel),
  ) || DEFAULT_LOGGER_LEVELS;

async function bootstrap() {
  // Đặt cấu hình môi trường theo múi giờ và số lượng thread
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  process.env.uv_threadpool_size = os.cpus().length.toString();

  // Tạo ứng dụng NestJS
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: loggerLevels,
    },
  );

  // Kết nối microservice
  app.connectMicroservice<MicroserviceOptions>(grpcServerOptions);
  await app.startAllMicroservices();

  // Cấu hình CORS
  app.enableCors({
    origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || '*',
  });

  // Cấu hình prefix cho tất cả các route
  app.setGlobalPrefix(PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const constraint =
          Object.values(firstError.constraints || {})[0] || 'Invalid input';
        throw new HttpException(
          new ExceptionResponseDetail(
            HttpStatus.BAD_REQUEST,
            constraint,
            MessageCode.INVALID_INPUT,
          ),
          HttpStatus.OK,
        );
      },
    }),
  );

  // Tạo tài liệu Swagger
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig(SERVICE_NAME),
  );
  SwaggerModule.setup(PREFIX, app, document);

  let moment: any = require('moment-timezone');
  await app.listen(process.env.SERVICE_PORT, '0.0.0.0');

  Logger.debug(moment().tz('Asia/Ho_Chi_Minh').format());
  Logger.debug('moment without time-zone', moment().format());

  for (const k in envConfig) {
    if (!k.includes('PASSWORD') && !k.includes('SECRET')) {
      Logger.debug(`${k}=${envConfig[k]}`);
    }
  }
}

bootstrap().then(() => Logger.log(`${SERVICE_NAME} service started`));
