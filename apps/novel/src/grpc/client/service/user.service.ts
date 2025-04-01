import { Injectable } from '@nestjs/common';

@Injectable()
export class UserGRPCService {
    // private userServiceClient: UserServiceClient;

    constructor() // private readonly clientGrpc: ClientGrpc, // @Inject(GRPC_NAME.GRPC_NODEJS_USER)
    {
        // this.userServiceClient =
        //   this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
    }
}
