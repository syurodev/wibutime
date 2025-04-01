export enum ROLE_ENUM {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  CONTENT_MANAGER = 'content_manager',
  USER = 'user',
}

export enum USER_PERMISSION_ENUM {
  CREATE = 'user.create',
  READ = 'user.read',
  UPDATE = 'user.update',
  DELETE = 'user.delete',
  BLOCK = 'user.block',
}

export enum CONTENT_PERMISSION_ENUM {
  CREATE = 'content.create',
  READ = 'content.read',
  UPDATE = 'content.update',
  DELETE = 'content.delete',
  PUBLISH = 'content.publish',
}

export enum COMMENT_PERMISSION_ENUM {
  CREATE = 'comment.create',
  READ = 'comment.read',
  UPDATE = 'comment.update',
  DELETE = 'comment.delete',
  MODERATE = 'comment.moderate',
}

export enum REPORT_PERMISSION_ENUM {
  CREATE = 'report.create',
  READ = 'report.read',
  UPDATE = 'report.update',
  DELETE = 'report.delete',
}
