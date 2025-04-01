import { Metadata } from '@grpc/grpc-js';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcUtil } from '@workspace/commons';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  ValidateTokenDTO,
  ValidateTokenResponse,
} from '../interfaces/auth';

@Injectable()
export class AuthGRPCService {
  private readonly authServiceClient: AuthServiceClient;
  constructor(
    @Inject('USER_GRPC')
    private readonly clientGrpc: ClientGrpc,
  ) {
    this.authServiceClient =
      this.clientGrpc.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async validateToken(
    request: ValidateTokenDTO,
    metadata?: Metadata,
  ): Promise<ValidateTokenResponse> {
    try {
      return await GrpcUtil.reTry<ValidateTokenResponse>(
        this.authServiceClient.validateToken(
          request,
          metadata ?? new Metadata(),
        ),
      );
    } catch (e) {
      throw new HttpException(
        {
          status: 400,
          message: e.message,
          message_code: 'GRPC_ERROR',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
