import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { loginSchema } from "./schemas/zod/auth/auth.schema";
import { ResponseMessage } from "./common/response/message.response";

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

        if (!validatedField.success) {
          throw new CredentialsSignin("Dữ liệu nhập vào không hợp lệ!");
        }

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
            cache: "no-cache",
          }
        );

        const existingUser: ApiResponse<UserResponse> = await res.json();

        if (!res.ok || existingUser.status !== 200 || !existingUser.data) {
          throw new CredentialsSignin(existingUser.message, {
            name: existingUser.message,
          });
        }

        return existingUser.data;
      },
    }),
  ],
} satisfies NextAuthConfig;
