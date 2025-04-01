import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { ProxyMiddleware } from './common/middleware/proxy.middleware';
import { GrpcModule } from './grpc/client/grpc.module';

@Module({
  imports: [GrpcModule],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'health-check', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      // .apply(DecryptMiddleware)
      // .exclude({ path: 'health-check', method: RequestMethod.ALL })
      // .forRoutes({ path: '*', method: RequestMethod.POST })
      .apply(ProxyMiddleware)
      .exclude({ path: 'health-check', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
