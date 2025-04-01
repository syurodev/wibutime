import { Global, Module } from '@nestjs/common';
import {
  ClientProviderOptions,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { channelOptions, keepalive, loader } from 'src/config/grpc.config';
import { COM_BASE_GRPC_NODEJS_USER_AUTH_PACKAGE_NAME } from './interfaces/auth';
import { AuthGRPCService } from './service/auth.service';

const grpcClientOptions = (init: {
  name: string;
  package: string[];
  protoPath: string[];
  url: string;
}): ClientProviderOptions => {
  return {
    name: init.name,
    transport: Transport.GRPC,
    options: {
      package: init.package,
      protoPath: init.protoPath,
      url: init.url,
      loader: loader,
      keepalive: keepalive,
      channelOptions: channelOptions,
    },
  };
};

@Global()
@Module({
  imports: [
    ClientsModule.register([
      grpcClientOptions({
        name: 'USER_GRPC',
        package: [COM_BASE_GRPC_NODEJS_USER_AUTH_PACKAGE_NAME],
        protoPath: [join(__dirname, './protos/auth.proto')],
        url: `${process.env.CONFIG_GRPC_NODEJS_USER_HOST}:${process.env.CONFIG_GRPC_NODEJS_USER_PORT}`,
      }),
    ]),
  ],
  providers: [AuthGRPCService],
  exports: [ClientsModule, AuthGRPCService],
})
export class GrpcModule {}
