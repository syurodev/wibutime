import { CredentialsSignin, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { loginSchema } from "./schemas/zod/auth/auth.schema";
import { AUTH_API_ENDPOINT } from "./common/enum/endpoint/auth";
import { FETCH_POST } from "./common/fetch/post";

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

        const res = await FETCH_POST<UserResponse>(
          AUTH_API_ENDPOINT.LOGIN_V1,
          { username: username, password: password },
          false,
          "no-cache"
        );

        console.log(res);

        if (res.status !== 200) {
          throw new CredentialsSignin();
        }

        const existingUser: UserResponse = res.data!;

        return existingUser;
      },
    }),
  ],
} satisfies NextAuthConfig;
