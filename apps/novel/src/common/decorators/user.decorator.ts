import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  id: string;
  email: string;
  roles: {
    id: number;
    name: string;
  }[];
  permissions: {
    id: number;
    name: string;
    action: string;
    module: string;
  }[];
}

export const User = createParamDecorator(
  (data: keyof UserInfo | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserInfo = {
      id: request.headers['x-user-id'],
      email: request.headers['x-user-email'],
      roles: JSON.parse(request.headers['x-user-roles'] || '[]'),
      permissions: JSON.parse(request.headers['x-user-permissions'] || '[]'),
    };

    return data ? user[data] : user;
  },
);
