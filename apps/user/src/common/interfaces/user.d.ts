import { Permission } from '@workspace/types';
import { EditorContent } from './editor';

export type UserRoleAndPermission = {
  id: number;
  bio: EditorContent[];
  name: string;
  email: string;
  roles: IRole[];
  avatar: string;
  is_block: number;
  username: string;
  password: string;
  permissions: Permission[];
  is_verify_email: number;
  is_change_password: number;
};
