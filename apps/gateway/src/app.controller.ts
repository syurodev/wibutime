import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get('health-check')
  async healthCheck(@Res() res: Response) {
    return res.status(HttpStatus.OK).send({
      status: HttpStatus.OK,
      message: 'Server is running',
      data: {
        build_number: process.env.CONFIG_BUILD_NUMBER || '',
        build_time: process.env.CONFIG_BUILD_TIME || '',
      },
    });
  }
}
