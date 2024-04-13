import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { JWT } from "next-auth/jwt";

async function refreshToken(token: JWT): Promise<JWT | null> {
  console.log("refreshToken");
  const res = await fetch(process.env.CONFIG_GATEWAY_URL + "/auth/refresh", {
    method: "POST",
    headers: {
      authorization: `refreshToken ${token.backendToken?.refreshToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: token.id,
      email: token.email,
      name: token.name,
      refreshToken: token.backendToken?.refreshToken,
    }),
    cache: "no-cache",
  });
  if (!res.ok) return null;

  const result: ApiResponse<AccessToken> = await res.json();
  console.log(result.data.expires_in);

  if (!result.data) return null;

  return {
    ...token,
    backendToken: {
      ...result.data,
      refreshToken: token.backendToken?.refreshToken,
    },
  };
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    async signIn({ user, account }): Promise<any> {
      try {
        //Alow OAuth without email verification
        // console.log("signIn", { user });
        if (account?.provider !== "credentials") return true;

        if (!user) return false;

        // const res = await fetch(
        //   `${process.env.CONFIG_GATEWAY_URL}/users/${user.id}`,
        //   {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        // if (!res.ok) return false;

        // const existingUser: ApiResponse<UserResponse> = await res.json();

        const userData: UserResponse = user as UserResponse;

        // if (existingUser.data && !existingUser?.data.email_verified) {
        if (userData && !userData.email_verified) {
          const res = await fetch(
            process.env.CONFIG_GATEWAY_URL + "/auth/send-verification-email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: userData.email,
                name: userData.name,
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

          return {
            status: 1,
            message: "Tài khoản chưa được xác minh!",
          };
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    async session({ session, user, token }) {
      // console.log("session", { token });
      session.user = {
        id: token.id,
        email: token.email,
        coins: token.coins,
        image: token.image,
        provider: token.provider,
        name: token.name,
        permissions: token.permissions,
        roles: token.roles,
        username: token.username,
        email_verified: token.email_verified,
        emailVerified: null,
      };

      session.backendToken = token.backendToken!;

      return session;
    },

    async jwt({ token, user }) {
      // console.log("jwt user", user);
      if (user) return { ...token, ...user } as JWT;

      console.log(
        "token.backendToken?.expires_in",
        token.backendToken?.expires_in
      ); //1708697827823
      console.log("new Date().getTime()", new Date().getTime()); //1712992765563

      if (new Date().getTime() < token.backendToken?.expires_in!) {
        return token;
      }
      return await refreshToken(token);
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
