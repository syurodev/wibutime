import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { BaseResponse } from '@workspace/commons';
import { FastifyReply } from 'fastify';

@Controller('public')
export class PublicController {
  @Get('health-check')
  async healthCheck(@Res() res: FastifyReply) {
    const response: BaseResponse<any> = new BaseResponse<any>();
    response.setData({
      build_number: process.env.CONFIG_BUILD_NUMBER || '',
      build_time: process.env.CONFIG_BUILD_TIME || '',
    });

    return res.status(HttpStatus.OK).send(response);
  }
}
