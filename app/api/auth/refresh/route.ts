import { deleteSession, getSession, updateSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

// Global map to track pending refresh requests
// Key: refresh_token, Value: Promise<NextResponse>
const pendingRefreshes = new Map<string, Promise<NextResponse>>();

export async function POST() {
  const session = await getSession();

  if (!session?.refreshToken) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const refreshToken = session.refreshToken;

  // Check if there is already a pending refresh for this token
  if (pendingRefreshes.has(refreshToken)) {
    try {
      // Wait for the pending refresh to complete and return its result
      // We clone the response because the original might have been read already
      const response = await pendingRefreshes.get(refreshToken);
      return response
        ? response.clone()
        : NextResponse.json(
            { error: "Concurrent refresh failed" },
            { status: 500 }
          );
    } catch (error) {
      console.error("Concurrent refresh error:", error);
      return NextResponse.json(
        { error: "Concurrent refresh error" },
        { status: 500 }
      );
    }
  }

  // Create a new refresh promise
  const refreshPromise = (async () => {
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
            refresh_token: refreshToken,
            client_id: process.env.OAUTH_CLIENT_ID!,
            client_secret: process.env.OAUTH_CLIENT_SECRET!,
          }),
        }
      );

      if (!tokenResponse.ok) {
        // Token refresh failed - delete session cookie to prevent retry loop
        await deleteSession();
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
        refreshToken: tokens.refresh_token || refreshToken,
        expiresAt: Date.now() + tokens.expires_in * 1000,
      });

      return NextResponse.json({
        success: true,
        accessToken: tokens.access_token,
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      // Internal error during refresh - delete session to prevent retry
      await deleteSession();
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  })();

  // Store the promise in the map
  pendingRefreshes.set(refreshToken, refreshPromise);

  try {
    // Wait for the promise to resolve
    const response = await refreshPromise;
    return response;
  } finally {
    // Clean up the map entry when done (success or error)
    pendingRefreshes.delete(refreshToken);
  }
}
