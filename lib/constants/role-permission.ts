/**
 * Global Roles enum based on backend seed_roles.go
 */
export enum GlobalRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  CREATOR = "CREATOR",
  USER = "USER",
  GUEST = "GUEST",
}

/**
 * Global Permissions enum based on backend seed_roles.go
 */
export enum GlobalPermission {
  // Auth & User
  AUTH_LOGIN = "auth:login",
  AUTH_LOGOUT = "auth:logout",
  AUTH_REFRESH_TOKEN = "auth:refresh_token",
  USER_VIEW_SELF = "user:view_self",
  USER_UPDATE_SELF = "user:update_self",
  USER_DELETE_SELF = "user:delete_self",
  USER_CHANGE_PASSWORD = "user:change_password",
  USER_2FA_MANAGE = "user:two_fa_manage",

  // Social / Community
  COMMENT_CREATE = "comment:create",
  COMMENT_UPDATE_SELF = "comment:update_self",
  COMMENT_DELETE_SELF = "comment:delete_self",
  COMMENT_REPORT = "comment:report",
  REACTION_ADD = "reaction:add",
  REVIEW_CREATE = "review:create",
  REVIEW_UPDATE_SELF = "review:update_self",
  REVIEW_DELETE_SELF = "review:delete_self",
  FOLLOW_CONTENT = "follow:content",
  FOLLOW_USER = "follow:user",
  TRANSLATION_SUBMIT = "translation:submit",
  TRANSLATION_UPDATE_SELF = "translation:update_self",
  TRANSLATION_VOTE = "translation:vote",
  SUBTITLE_CONTRIBUTE = "subtitle:contribute",
  REPORT_CONTENT = "report:content",
  // Content viewing
  CONTENT_VIEW_PUBLIC = "content:view_public",
  CONTENT_VIEW_PURCHASED = "content:view_purchased",
  CONTENT_STREAM_ANIME = "content:stream_anime",
  CONTENT_READ_MANGA = "content:read_manga",
  CONTENT_READ_NOVEL = "content:read_novel",

  // Master data: Character
  CHARACTER_VIEW = "character:view",
  CHARACTER_CONTRIBUTE = "character:contribute",
  CHARACTER_CONTRIBUTE_UPDATE_SELF = "character:contribute_update_self",
  CHARACTER_CREATE = "character:create",
  CHARACTER_APPROVE = "character:approve",
  CHARACTER_REJECT = "character:reject",
  CHARACTER_UPDATE = "character:update",
  CHARACTER_DELETE = "character:delete",

  // Master data: Creator
  CREATOR_VIEW = "creator:view",
  CREATOR_CREATE = "creator:create",
  CREATOR_UPDATE = "creator:update",
  CREATOR_DELETE = "creator:delete",

  // Master data: Genre
  GENRE_VIEW = "genre:view",
  GENRE_CREATE = "genre:create",
  GENRE_UPDATE = "genre:update",
  GENRE_DELETE = "genre:delete",

  // Master data: Relations
  RELATION_VIEW = "relation:view",
  RELATION_CREATE = "relation:create",
  RELATION_UPDATE = "relation:update",
  RELATION_DELETE = "relation:delete",

  // Moderation & System
  MODERATION_CONTENT_REVIEW = "moderation:content_review",
  MODERATION_USER_SUSPEND = "moderation:user_suspend",
  MODERATION_BAN = "moderation:ban",
  SYSTEM_CONFIG_MANAGE = "system:config_manage",
  SYSTEM_METRICS_VIEW = "system:metrics_view",
  SYSTEM_AUDIT_VIEW = "system:audit_view",
  SUPPORT_TICKET_MANAGE = "support:ticket_manage",
}

/**
 * Tenant Permissions enum based on backend seed_roles.go
 */
export enum TenantPermission {
  // Tenant Management
  TENANT_MANAGE_MEMBER = "tenant:manage_member",
  TENANT_ASSIGN_PERMISSION = "tenant:assign_permission",
  TENANT_UPDATE_INFO = "tenant:update_info",
  TENANT_VIEW_STATS = "tenant:view_stats",
  TENANT_BILLING_MANAGE = "tenant:billing_manage",

  // Content Management
  CONTENT_CREATE_ANIME = "content:create_anime",
  CONTENT_UPDATE_ANIME = "content:update_anime",
  CONTENT_DELETE_ANIME = "content:delete_anime",
  CONTENT_CREATE_MANGA = "content:create_manga",
  CONTENT_UPDATE_MANGA = "content:update_manga",
  CONTENT_DELETE_MANGA = "content:delete_manga",
  CONTENT_CREATE_NOVEL = "content:create_novel",
  CONTENT_UPDATE_NOVEL = "content:update_novel",
  CONTENT_DELETE_NOVEL = "content:delete_novel",

  // Anime Management
  ANIME_EPISODE_CREATE = "anime:episode_create",
  ANIME_EPISODE_UPDATE = "anime:episode_update",
  ANIME_EPISODE_DELETE = "anime:episode_delete",
  ANIME_SEASON_CREATE = "anime:season_create",
  ANIME_SEASON_UPDATE = "anime:season_update",
  ANIME_SEASON_DELETE = "anime:season_delete",

  // Manga Management
  MANGA_CHAPTER_CREATE = "manga:chapter_create",
  MANGA_CHAPTER_UPDATE = "manga:chapter_update",
  MANGA_CHAPTER_DELETE = "manga:chapter_delete",
  MANGA_VOLUME_CREATE = "manga:volume_create",
  MANGA_VOLUME_UPDATE = "manga:volume_update",
  MANGA_VOLUME_DELETE = "manga:volume_delete",

  // Novel Management
  NOVEL_CHAPTER_CREATE = "novel:chapter_create",
  NOVEL_CHAPTER_UPDATE = "novel:chapter_update",
  NOVEL_CHAPTER_DELETE = "novel:chapter_delete",
  NOVEL_VOLUME_CREATE = "novel:volume_create",
  NOVEL_VOLUME_UPDATE = "novel:volume_update",
  NOVEL_VOLUME_DELETE = "novel:volume_delete",

  // Master Data in Tenant Scope
  CHARACTER_MANAGE = "character:manage",
  CREATOR_MANAGE = "creator:manage",
  GENRE_MANAGE = "genre:manage",
  RELATION_MANAGE = "relation:manage",

  // Content Publishing
  CONTENT_PUBLISH = "content:publish",
  CONTENT_UNPUBLISH = "content:unpublish",
  ANALYTICS_VIEW = "analytics:view",
}

/**
 * Admin roles that have system management access
 */
export const ADMIN_ROLES = [
  GlobalRole.SUPER_ADMIN,
  GlobalRole.ADMIN,
  GlobalRole.MODERATOR,
] as const;

/**
 * Master data permissions grouped by entity
 */
export const MASTER_DATA_PERMISSIONS = {
  GENRE: [
    GlobalPermission.GENRE_VIEW,
    GlobalPermission.GENRE_CREATE,
    GlobalPermission.GENRE_UPDATE,
    GlobalPermission.GENRE_DELETE,
  ],
  CHARACTER: [
    GlobalPermission.CHARACTER_VIEW,
    GlobalPermission.CHARACTER_CREATE,
    GlobalPermission.CHARACTER_UPDATE,
    GlobalPermission.CHARACTER_DELETE,
    GlobalPermission.CHARACTER_APPROVE,
    GlobalPermission.CHARACTER_REJECT,
  ],
  CREATOR: [
    GlobalPermission.CREATOR_VIEW,
    GlobalPermission.CREATOR_CREATE,
    GlobalPermission.CREATOR_UPDATE,
    GlobalPermission.CREATOR_DELETE,
  ],
} as const;
