import { UserInfo } from "@/types/api";
import type { OIDCConfig } from "next-auth/providers";

export function createOIDCProvider(): OIDCConfig<any> {
    return {
        id: "oidc",
        name: "OIDC",
        type: "oidc",
        issuer: process.env.OIDC_ISSUER,
        // Use provider discovery from our identify service (standard dashed path)
        wellKnown: `${process.env.OIDC_ISSUER}/.well-known/openid-configuration`,
        clientId: process.env.OIDC_CLIENT_ID,
        clientSecret: process.env.OIDC_CLIENT_SECRET,
        authorization: {
            params: {
                scope: "openid profile email offline_access",
            },
        },
        // Let NextAuth handle PKCE + state and use discovery endpoints
        checks: ["pkce", "state"],
        profile: (profile: UserInfo) => ({
            id: profile.sub,
            name: profile.name || profile.preferred_username,
            email: profile.email,
            image: profile.picture,
        }),
    };
}
