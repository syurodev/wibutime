import NextAuth from "next-auth";
import moment from "moment";

import authConfig from "@/auth.config";
import { JWT } from "next-auth/jwt";
import { AUTH_API_ENDPOINT } from "./common/enum/endpoint/auth";
import { FETCH_POST } from "./common/fetch/post";

async function refreshToken(token: JWT): Promise<JWT | null> {
  console.log("refreshToken", token.backend_token?.expires_in);
  const res = await fetch(
    process.env.CONFIG_GATEWAY_URL + AUTH_API_ENDPOINT.REFRESH_TOKEN_V1,
    {
      method: "POST",
      headers: {
        authorization: `refreshToken ${token.backend_token?.refresh_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: token.id,
        email: token.email,
        name: token.name,
        refreshToken: token.backend_token?.refresh_token,
      }),
      cache: "no-cache",
    }
  );
  if (!res.ok) return null;

  const result: ApiResponse<AccessToken> = await res.json();
  if (!result.data) return null;

  return {
    ...token,
    backendToken: {
      accessToken: result.data.access_token,
      expires_in: Number(result.data.expires_in),
      refreshToken: token.backend_token?.refresh_token,
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
    signIn: "/auth?page=login",
    // error: "/auth&error",
  },
  callbacks: {
    async signIn({ user, account }): Promise<any> {
      try {
        //Alow OAuth without email verification
        // console.log("signIn", { user });
        if (account?.provider !== "credentials") return true;

        if (!user) {
          return false;
        }
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
          const res = await FETCH_POST(
            AUTH_API_ENDPOINT.SEND_VERIFICATION_CODE_V1,
            {
              email: userData.email,
              name: userData.name,
            },
            false,
            "no-cache"
          );

          if (res.status !== 200) return false;

          throw new Error("Tài khoản chưa được xác minh!");
        }
        return true;
      } catch (error) {
        console.log(error);
        throw new Error("Có lỗi trong quá trình đăng nhập, vui lòng thử lại!");
      }
    },

    async session({ session, user, token }) {
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

      session.backend_token = token.backend_token!;

      return session;
    },

    async jwt({ token, user }) {
      // console.log("jwt user", user);
      if (user) return { ...token, ...user } as JWT;

      // Chuyển đổi thời gian hiện tại của hệ thống sang múi giờ +7
      const systemTime = moment().utcOffset("+07:00");

      // Chuyển đổi thời gian hết hạn từ milliseconds thành đối tượng Moment
      const expirationTime = moment(
        Number(token.backend_token?.expires_in)
      ).utcOffset("+07:00");

      // So sánh thời gian hiện tại của hệ thống với thời gian hết hạn của token
      if (systemTime.isBefore(expirationTime)) {
        // Token còn hiệu lực
        return token;
      } else {
        // Token đã hết hạn, thực hiện refresh token
        return await refreshToken(token);
      }
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
