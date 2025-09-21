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
                console.log("Processing account tokens...");
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
                console.log("Processing profile data...");
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
            }

            return token;
        },
        session({ session, token }) {
            // Expose access token to the client session
            // @ts-ignore
            session.accessToken = token.accessToken as string | undefined;
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
        async createUser(message) {
            console.log("Event createUser:", message);
        },
        async updateUser(message) {
            console.log("Event updateUser:", message);
        },
        async linkAccount(message) {
            console.log("Event linkAccount:", message);
        },
        async session(message) {
            console.log("Event session:", message);
        },
    },
    logger: {
        error(code, ...message) {
            console.error("NextAuth ERROR:", code, message);
        },
        warn(code, ...message) {
            console.warn("NextAuth WARN:", code, message);
        },
        debug(code, ...message) {
            console.log("NextAuth DEBUG:", code, message);
        },
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
