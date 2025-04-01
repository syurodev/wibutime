import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AESEncryption } from '@syurodev/ts-common';
import * as process from 'node:process';

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
  private aesEncryption: AESEncryption;

  constructor() {
    // Khởi tạo EncryptionService với secretKey, thay đổi giá trị này cho phù hợp
    this.aesEncryption = new AESEncryption(
      process.env.ENCRYPTION_SECRET_KEY ?? '',
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      next();
    }

    if (!req?.body?.payload) {
      return res.status(400).send({ error: 'payload is required' });
    }

    try {
      // Giải mã dữ liệu body từ client
      req.body = this.aesEncryption.decrypt(req.body.payload);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Xử lý trường hợp giải mã thất bại
      return res.status(400).send({ error: 'Dữ liệu mã hóa không hợp lệ' });
    }

    next();
  }
}
