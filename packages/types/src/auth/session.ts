import { Permission } from './permission';
import { Role } from './role';

export class Session {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar: string;
  roles: Role[];
  permissions: Permission[];
  access_token: string;
  refresh_token: string;
}
