import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthGRPCService } from 'src/grpc/client/service/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authGRPCService: AuthGRPCService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const path = request.path;

    // Log incoming request path for debugging
    console.log(`[AuthMiddleware] Processing request for path: ${path}`);

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log(`[AuthMiddleware] No token found for path: ${path}`);
      // throw new UnauthorizedException('Authorization token is required');
      next();
    }

    try {
      const isValid = await this.validateToken(token, request);

      if (!isValid) {
        console.log(`[AuthMiddleware] Invalid token for path: ${path}`);
        // throw new UnauthorizedException('Invalid token');
      }

      console.log(`[AuthMiddleware] Valid token for path: ${path}`);
      next();
    } catch (error) {
      console.log(
        `[AuthMiddleware] Error validating token for path: ${path}`,
        error,
      );
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateToken(
    token: string,
    request: Request,
  ): Promise<boolean> {
    const result = await this.authGRPCService.validateToken({ token });

    if (result.data) {
      // Attach user data to request headers
      request.headers['x-user-id'] = result.data.user.id.toString();
      request.headers['x-user-email'] = result.data.user.email;
      request.headers['x-user-roles'] = JSON.stringify(result.data.user.roles);
      request.headers['x-user-permissions'] = JSON.stringify(
        result.data.user.permissions,
      );
    }

    return true;
  }
}
