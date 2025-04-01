import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { COM_BASE_GRPC_NODEJS_USER_AUTH_PACKAGE_NAME } from './interfaces/auth';

export const grpcServerOptions: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    url: `0.0.0.0:${process.env.GRPC_SERVER_PORT}`,
    package: [COM_BASE_GRPC_NODEJS_USER_AUTH_PACKAGE_NAME],
    protoPath: [join(__dirname, './protos/auth.proto')],
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  },
};
