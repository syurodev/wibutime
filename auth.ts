import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & UserResponse;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      //Alow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user) return false;
      const res = await fetch(
        `${process.env.CONFIG_GATEWAY_URL}/users/${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) return false;

      const existingUser: UserResponse = await res.json();

      if (existingUser && !existingUser?.email_verified) {
        const res = await fetch(
          process.env.CONFIG_GATEWAY_URL + "/auth/send-verification-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: existingUser.email,
              name: existingUser.name,
            }),
          }
        );

        if (!res.ok) return false;

        const result: ApiResponse<{
          result: boolean;
        }> = await res.json();

        if (result.status !== 200 || result.data.result === false) {
          return false;
        }
      }
      return true;
    },

    async session({ session, user, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub.toString();
      }

      if (token.role && session.user) {
        session.user.roles = token.roles as UserRole[];
      }

      if (token.permissions && session.user) {
        session.user.permissions = token.permissions as UserPermissions[];
      }

      if (token.username && session.user) {
        session.user.username = token.username as string;
      }

      if (token.coins && session.user) {
        session.user.coins = token.coins as number;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const res = await fetch(
        process.env.CONFIG_GATEWAY_URL + `/users/${token.sub}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) return token;

      const userData: ApiResponse<UserResponse> = await res.json();

      if (!userData) return token;

      token.role = userData.data.roles;
      if (userData?.data.username) {
        token.username = userData.data.username;
      }

      token.permissions = userData.data.permissions;
      token.coins = userData.data.coins;

      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
