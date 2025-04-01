import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UserGRPCService } from './service/user.service';

@Global()
@Module({
    imports: [],
    providers: [UserGRPCService],
    exports: [ClientsModule, UserGRPCService],
})
export class GrpcModule {}
