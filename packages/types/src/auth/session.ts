import { Permission } from './permission';
import { Role } from './role';

export class Session {
  user!: {
    id: number;
    username: string;
    email: string;
    avatar: string;
    roles: Role[];
    permissions: Permission[];
  };
  token!: {
    access_token: string;
    refresh_token: string;
  };
}
