import { NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/auth/session";

export async function POST() {
  const session = await getSession();

  if (!session || !session.refreshToken) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  try {
    // Use refresh token to get new access token
    const tokenResponse = await fetch(
      `${process.env.OAUTH_ISSUER}/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: session.refreshToken,
          client_id: process.env.OAUTH_CLIENT_ID!,
          client_secret: process.env.OAUTH_CLIENT_SECRET!,
        }),
      }
    );

    if (!tokenResponse.ok) {
      // Token refresh failed - return 401 to trigger session clear on client
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: 401 }
      );
    }

    const tokens = await tokenResponse.json();

    // Update session with new tokens
    await updateSession({
      ...session,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || session.refreshToken,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Internal error during refresh
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
