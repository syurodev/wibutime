import { HttpStatus } from '@nestjs/common';
import {
  MessageCode,
  MessageCodeDescription,
} from '../constants/message-codes.enum';

export class ExceptionResponseDetail {
  public status: HttpStatus | number;
  public message: string;
  public message_code: MessageCode;
  public data: null;

  constructor(
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string = MessageCodeDescription[MessageCode.INTERNAL_SERVER_ERROR],
    messageCode: MessageCode = MessageCode.INTERNAL_SERVER_ERROR,
    data?: any,
  ) {
    this.status = status;
    this.message = message;
    this.message_code = messageCode;
    this.data = data ?? null;
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

  public getData(): any {
    return this.data;
  }

  public setData(data: any): void {
    this.data = data;
  }
}
