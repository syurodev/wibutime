import { Body, Controller, Post, Res, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  BaseResponse,
  MessageCode,
  MessageCodeDescription,
} from '@workspace/commons';
import { FastifyReply } from 'fastify';
import { AllExceptionsFilter } from 'src/common/all-exceptions.filter';
import { LoginDto } from 'src/v1/auth/dto/login.dto';
import { RegisterDto } from 'src/v1/auth/dto/register.dto';
import { AuthService } from './auth.service';
import { ValidateTokenDto } from './dto/validate-token.dto';

@UseFilters(new AllExceptionsFilter())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: FastifyReply) {
    const response = new BaseResponse<any>();

    const result = await this.authService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
    response.setData({
      id: result.id,
      username: result.username,
      email: result.email,
    });
    response.setMessageCode(MessageCode.CREATED);
    response.setMessage(MessageCodeDescription[MessageCode.CREATED]);

    return res.status(response.getStatus()).send(response);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: FastifyReply) {
    const response = new BaseResponse<any>();

    const userData = await this.authService.login(
      loginDto.username,
      loginDto.password,
      {
        deviceId: loginDto.deviceId,
        deviceName: loginDto.deviceName,
        deviceType: loginDto.deviceType,
        deviceOs: loginDto.deviceOs,
        browserInfo: loginDto.browserInfo,
        ipAddress: loginDto.ipAddress,
      },
    );

    response.setData(userData);
    response.setMessageCode(MessageCode.SUCCESS);
    response.setMessage(MessageCodeDescription[MessageCode.SUCCESS]);

    return res.status(response.getStatus()).send(response);
  }

  @Post('validate-token')
  async validateToken(
    @Body()
    body: ValidateTokenDto,
    @Res() res: FastifyReply,
  ) {
    const response = new BaseResponse<any>();
    response.setData(await this.authService.validateToken(body.token));
    response.setMessageCode(MessageCode.SUCCESS);
    response.setMessage(MessageCodeDescription[MessageCode.SUCCESS]);
    return res.status(response.getStatus()).send(response);
  }

  @GrpcMethod('AuthService', 'validateToken')
  async validateTokenGrpc(
    @Body()
    body: ValidateTokenDto,
  ) {
    const response = new BaseResponse<any>();
    response.setData(await this.authService.validateToken(body.token));
    response.setMessageCode(MessageCode.SUCCESS);
    response.setMessage(MessageCodeDescription[MessageCode.SUCCESS]);
    return response;
  }

  @Post('trust-device')
  async trustDevice(
    @Body() body: { deviceId: string; userId: number },
    @Res() res: FastifyReply,
  ) {
    const response = new BaseResponse<any>();
    await this.authService.trustDevice(body.userId, body.deviceId);
    response.setMessageCode(MessageCode.SUCCESS);
    response.setMessage(MessageCodeDescription[MessageCode.SUCCESS]);
    return res.status(response.getStatus()).send(response);
  }

  @Post('revoke-device')
  async revokeDevice(
    @Body() body: { deviceId: string; userId: number },
    @Res() res: FastifyReply,
  ) {
    const response = new BaseResponse<any>();
    await this.authService.revokeDevice(body.userId, body.deviceId);
    response.setMessageCode(MessageCode.SUCCESS);
    response.setMessage(MessageCodeDescription[MessageCode.SUCCESS]);
    return res.status(response.getStatus()).send(response);
  }

  @Post('get-user-devices')
  async getUserDevices(
    @Body() body: { userId: number },
    @Res() res: FastifyReply,
  ) {
    const response = new BaseResponse<any>();
    const devices = await this.authService.getUserDevices(body.userId);
    response.setData(devices);
    response.setMessageCode(MessageCode.SUCCESS);
    response.setMessage(MessageCodeDescription[MessageCode.SUCCESS]);
    return res.status(response.getStatus()).send(response);
  }
}
