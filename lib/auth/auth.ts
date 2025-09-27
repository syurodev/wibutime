import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import { routing } from "../i18n/routing";
import { createOIDCProvider } from "./oauth-provider";

const PUBLIC_ROUTES = new Set(["/auth/signin", "/auth/error"]);

export const authConfig: NextAuthConfig = {
    providers: [createOIDCProvider()],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    debug: false,
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            const pathname = nextUrl.pathname;
            const segments = pathname.split("/").filter(Boolean);
            const potentialLocale = segments[0];
            const hasLocale = potentialLocale
                ? routing.locales.includes(potentialLocale as any)
                : false;
            const relativeSegments = hasLocale ? segments.slice(1) : segments;
            const normalizedPath =
                `/${relativeSegments.join("/")}`.replace(/\/$/, "") || "/";

            if (
                PUBLIC_ROUTES.has(normalizedPath) ||
                normalizedPath.startsWith("/auth/")
            ) {
                return true;
            }

            const isProtectedRoute = normalizedPath.startsWith("/protected");

            if (isProtectedRoute) {
                return isLoggedIn;
            }

            return true;
        },
        jwt({ token, account, profile }) {
            // On initial sign-in, persist OAuth tokens and basic profile into the JWT
            if (account) {
                // OAuth tokens
                // @ts-ignore
                token.accessToken = account.access_token;
                // @ts-ignore
                token.refreshToken = account.refresh_token;
                // id_token may be used by some clients
                // @ts-ignore
                token.idToken = account.id_token;
            }
            if (profile) {
                // Basic profile claims
                // @ts-ignore
                token.sub = (profile as any).sub || token.sub;
                // @ts-ignore
                token.name =
                    (profile as any).name ||
                    (profile as any).preferred_username ||
                    token.name;
                // @ts-ignore
                token.email = (profile as any).email || token.email;
                // @ts-ignore
                token.picture = (profile as any).picture || token.picture;

                // Persist roles and permissions
                // @ts-ignore
                token.globalRoleNames =
                    (profile as any).global_role_names || [];
                // @ts-ignore
                token.globalPermissions =
                    (profile as any).global_permissions || [];
                // @ts-ignore
                token.tenantRoleNames =
                    (profile as any).tenant_role_names || [];
                // @ts-ignore
                token.tenantPermissions =
                    (profile as any).tenant_permissions || [];
            }

            return token;
        },
        session({ session, token }) {
            // Expose access token to the client session
            // @ts-ignore
            session.accessToken = token.accessToken as string | undefined;

            // Map roles and permissions from JWT claims
            // @ts-ignore
            session.globalRoleNames = (token as any).globalRoleNames || [];
            // @ts-ignore
            session.globalPermissions = (token as any).globalPermissions || [];
            // @ts-ignore
            session.tenantRoleNames = (token as any).tenantRoleNames || [];
            // @ts-ignore
            session.tenantPermissions = (token as any).tenantPermissions || [];

            // Map basic user info from JWT claims
            if (!session.user) {
                // @ts-ignore
                session.user = {};
            }
            // @ts-ignore
            session.user.name = (token as any).name || null;
            // @ts-ignore
            session.user.email = (token as any).email || null;
            // @ts-ignore
            session.user.image = (token as any).picture || null;

            return session;
        },
        async signIn({ user, account, profile }) {
            return true;
        },
    },
    events: {
        async signIn(message) {},
        async signOut(message) {
            // Call backend logout to clear session cookie
            try {
                await fetch(`${process.env.OIDC_ISSUER}/api/v1/auth/logout`, {
                    method: "POST",
                    credentials: "include", // Include cookies
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}), // Empty JSON body
                });
            } catch (error) {
                console.error("Failed to call backend logout:", error);
            }
        },
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
