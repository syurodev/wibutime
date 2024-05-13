import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    email_verified: boolean;
    image: string;
    provider: string;
    coins: number;
    username?: string;
    password?: string;
    backend_token?: TokenResponse;
    roles?: string[];
    permissions?: string[];
  }
}
