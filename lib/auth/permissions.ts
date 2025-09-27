import { Session } from "next-auth";
import { GlobalRole, GlobalPermission, TenantPermission, ADMIN_ROLES, MASTER_DATA_PERMISSIONS } from "./constants";

/**
 * Check if the user has a specific global permission
 */
export function hasGlobalPermission(session: Session | null, permission: GlobalPermission): boolean {
    if (!session?.globalPermissions) return false;
    return session.globalPermissions.includes(permission);
}

/**
 * Check if the user has a specific global role
 */
export function hasGlobalRole(session: Session | null, role: GlobalRole): boolean {
    if (!session?.globalRoleNames) return false;
    return session.globalRoleNames.includes(role);
}

/**
 * Check if the user has a specific tenant permission
 */
export function hasTenantPermission(session: Session | null, permission: TenantPermission): boolean {
    if (!session?.tenantPermissions) return false;
    return session.tenantPermissions.includes(permission);
}

/**
 * Check if the user has a specific tenant role
 */
export function hasTenantRole(session: Session | null, roleName: string): boolean {
    if (!session?.tenantRoleNames) return false;
    return session.tenantRoleNames.includes(roleName);
}

/**
 * Check if the user is an admin (has ADMIN or SUPER_ADMIN global role)
 */
export function isAdmin(session: Session | null): boolean {
    return hasGlobalRole(session, GlobalRole.ADMIN) || hasGlobalRole(session, GlobalRole.SUPER_ADMIN);
}

/**
 * Check if the user is a super admin
 */
export function isSuperAdmin(session: Session | null): boolean {
    return hasGlobalRole(session, GlobalRole.SUPER_ADMIN);
}

/**
 * Check if the user is a moderator
 */
export function isModerator(session: Session | null): boolean {
    return hasGlobalRole(session, GlobalRole.MODERATOR);
}

/**
 * Check if the user can manage master data (genres, characters, creators)
 */
export function canManageMasterData(session: Session | null): boolean {
    return hasGlobalPermission(session, GlobalPermission.GENRE_CREATE) ||
           hasGlobalPermission(session, GlobalPermission.CHARACTER_CREATE) ||
           hasGlobalPermission(session, GlobalPermission.CREATOR_CREATE);
}

/**
 * Check if the user has any admin-level permissions
 */
export function hasAdminAccess(session: Session | null): boolean {
    if (!session?.globalRoleNames) return false;
    return ADMIN_ROLES.some(role => session.globalRoleNames!.includes(role));
}

/**
 * Check if the user has any permissions from a specific master data entity
 */
export function hasMasterDataAccess(session: Session | null, entity: keyof typeof MASTER_DATA_PERMISSIONS): boolean {
    if (!session?.globalPermissions) return false;
    return MASTER_DATA_PERMISSIONS[entity].some(permission =>
        session.globalPermissions!.includes(permission)
    );
}

/**
 * Get all permissions the user has for a specific master data entity
 */
export function getMasterDataPermissions(session: Session | null, entity: keyof typeof MASTER_DATA_PERMISSIONS): GlobalPermission[] {
    if (!session?.globalPermissions) return [];
    return MASTER_DATA_PERMISSIONS[entity].filter(permission =>
        session.globalPermissions!.includes(permission)
    );
}