import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageCode } from '@workspace/commons';
import { ExceptionResponseDetail } from '../responses/exception-response-detail.response';

type PGStoredProcedure = [
  {
    total_record?: number;
    result: unknown;
    status: number;
    message: string;
  },
];

export class StoreProcedureUtil {
  init: PGStoredProcedure;

  constructor(init: PGStoredProcedure) {
    if (!init?.[0]) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          'Invalid stored procedure response',
          MessageCode.QUERY_ERROR,
        ),
        HttpStatus.OK,
      );
    }

    if (init[0].status !== 0) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          init[0].message,
          MessageCode.QUERY_ERROR,
        ),
        HttpStatus.OK,
      );
    }
    this.init = init;
  }

  public getResult<T>(): T {
    return this.init[0].result as T;
  }

  public getTotalRecord(): number {
    return this.init[0].total_record || 0;
  }

  public getMessage(): string {
    return this.init[0].message;
  }

  public getStatus(): number {
    return this.init[0].status;
  }
}
