import { deleteSession, getSession, updateSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("🔄 [API] Refresh route called");
  const session = await getSession();

  if (!session?.refreshToken) {
    console.log("❌ [API] No refresh token in session");
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  try {
    console.log("🔄 [API] Calling backend refresh endpoint...");
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

    console.log("🔄 [API] Backend response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.log("❌ [API] Backend refresh failed:", errorText);
      // Token refresh failed - delete session cookie to prevent retry loop
      await deleteSession();
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: 401 }
      );
    }

    const tokens = await tokenResponse.json();
    console.log("✅ [API] Backend refresh success");

    // Update session with new tokens
    await updateSession({
      ...session,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || session.refreshToken,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    });
    console.log("✅ [API] Session updated");

    return NextResponse.json({
      success: true,
      accessToken: tokens.access_token,
    });
  } catch (error) {
    console.error("❌ [API] Token refresh error:", error);
    // Internal error during refresh - delete session to prevent retry
    await deleteSession();
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
