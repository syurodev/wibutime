import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    tenantId?: string
    globalRoleNames?: string[]
    globalPermissions?: string[]
    tenantRoleNames?: string[]
    tenantPermissions?: string[]
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    tenantId?: string
    globalRoleNames?: string[]
    globalPermissions?: string[]
    tenantRoleNames?: string[]
    tenantPermissions?: string[]
  }
}