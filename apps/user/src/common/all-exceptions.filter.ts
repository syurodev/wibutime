import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseResponse, MessageCode } from '@workspace/commons';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let status: HttpStatus;
    let message: string;
    let data: unknown;
    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      message =
        (exception.getResponse()?.['message'] || []).toString() || 'Error!';
    } else if (exception instanceof HttpException) {
      status = exception.getResponse()?.['status'] || exception.getStatus();
      message = exception.message || 'Error!';
      data = exception.getResponse()?.['data'];
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = (exception as Error)?.message || 'Internal Server Error!';
    }

    const res = new BaseResponse();
    res.setStatus(HttpStatus.BAD_REQUEST);
    res.setMessage(message);
    res.setMessageCode(MessageCode.BAD_REQUEST);

    const contextType = host.getType();
    if (contextType == 'http') {
      return response.status(HttpStatus.OK).send(res);
    } else if (contextType == 'rpc') {
      return res;
    }
  }
}
