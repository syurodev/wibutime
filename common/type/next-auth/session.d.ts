import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      email_verified: boolean;
      image: string;
      provider: string;
      coins: number;
      username?: string;
      roles?: string[];
      permissions?: string[];
    };

    backend_token: TokenResponse;
  }
}
