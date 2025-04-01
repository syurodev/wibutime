import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { PROJECT_ID } from '@workspace/commons';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const projectId = req.headers['x-project-id'];

    if (!projectId) {
      return res.status(400).send({ error: 'projectid is required' });
    }

    // Ánh xạ projectId với các URL đích
    const targetMap: Record<string, string> = {
      [PROJECT_ID.USER]: process.env.CONFIG_PROXY_USER_SERVICE,
      [PROJECT_ID.NOVEL]: process.env.CONFIG_PROXY_NOVEL_SERVICE,
    };

    console.log(targetMap[projectId as string]);

    const target: string = targetMap[projectId as string];

    if (!target) {
      return res.status(404).send({ error: 'projectid invalid' });
    }

    // Tạo proxy middleware
    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      proxyTimeout: 60000,
      secure: false,
      on: {
        proxyReq: fixRequestBody,
      },
    });

    // Xử lý lỗi thủ công
    await proxy(req, res, (proxyErr: any) => {
      if (proxyErr) {
        Logger.error('Proxy error:', proxyErr.message);
        return res.status(500).send({ error: 'Proxy error occurred' });
      }
      next();
    });
  }
}
