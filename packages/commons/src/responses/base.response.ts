import { HttpStatus } from '@nestjs/common';
import { MessageCode } from '@workspace/commons';

export class BaseResponse<T> {
  public status: HttpStatus | number;
  public message: string;
  public message_code: MessageCode;
  public data: T;
  public limit?: number;
  public total_record?: number;

  constructor(
    status: number = HttpStatus.OK,
    message: string = 'Success',
    messageCode: MessageCode = MessageCode.SUCCESS,
    data?: T,
    limit?: number,
    total_record?: number,
  ) {
    this.status = status ? +status : +HttpStatus.OK;
    this.message = message ?? 'SUCCESS';
    this.message_code = messageCode;
    this.data = data ?? null;
    this.limit = limit;
    this.total_record = total_record;
  }

  public getStatus(): HttpStatus {
    return this.status;
  }

  public setStatus(status: HttpStatus): void {
    this.status = status;
  }

  public getMessage(): string {
    return this.message;
  }

  public setMessage(message: string): void {
    this.message = message;
  }

  public getMessageCode(): MessageCode {
    return this.message_code;
  }

  public setMessageCode(messageCode: MessageCode): void {
    this.message_code = messageCode;
  }

  public getData(): T {
    return this.data;
  }

  public setData(data: T): void {
    this.data = data;
  }

  public getLimit(): number | undefined {
    return this.limit;
  }

  public setLimit(limit: number): void {
    this.limit = limit;
  }

  public getTotalRecord(): number | undefined {
    return this.total_record;
  }

  public setTotalRecord(total_record: number): void {
    this.total_record = total_record;
  }
}
