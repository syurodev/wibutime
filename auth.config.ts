import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { loginSchema } from "./schemas/zod/auth/auth.schema";

export default {
  // debug: true,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          image: profile.picture,
          email: profile.email,
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedField = loginSchema.safeParse(credentials);

        if (validatedField.success) {
          const { username, password } = validatedField.data;

          const res = await fetch(
            `${process.env.CONFIG_GATEWAY_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username,
                password,
              }),
            }
          );

          const existingUser: ApiResponse<UserResponse> = await res.json();

          if (!res.ok || existingUser.status !== 200 || !existingUser.data) {
            return null;
          }

          return existingUser.data;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
