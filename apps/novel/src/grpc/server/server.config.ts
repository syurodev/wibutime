import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcServerOptions: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    url: `0.0.0.0:${process.env.GRPC_SERVER_PORT}`,
    package: ['com.zen.grpc.nodejs.lightnovel.service'],
    protoPath: [join(__dirname, './protos/lightnovel.proto')],
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  },
};
