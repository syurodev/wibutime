import { createSession } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Get stored values from cookies
  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;
  const callbackUrl = cookieStore.get("oauth_callback_url")?.value || "/";

  // Get locale from cookie (next-intl stores it in NEXT_LOCALE cookie)
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  // Helper to clean up OAuth cookies
  const cleanupOAuthCookies = () => {
    cookieStore.delete("oauth_state");
    cookieStore.delete("oauth_code_verifier");
    cookieStore.delete("oauth_callback_url");
  };

  // Verify state parameter for CSRF protection
  if (!state || state !== storedState) {
    cleanupOAuthCookies();
    return NextResponse.redirect(
      `${appUrl}/${locale}/login?error=invalid_state`
    );
  }

  if (!code || !codeVerifier) {
    cleanupOAuthCookies();
    return NextResponse.redirect(
      `${appUrl}/${locale}/login?error=missing_parameters`
    );
  }

  try {
    const tokenEndpoint = `${process.env.OAUTH_ISSUER}/oauth2/token`;
    const redirectUri = `${appUrl}/api/auth/callback`;

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        client_id: process.env.OAUTH_CLIENT_ID!,
        client_secret: process.env.OAUTH_CLIENT_SECRET!,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", tokenResponse.status, error);
      cleanupOAuthCookies();
      return NextResponse.redirect(
        `${appUrl}/${locale}/login?error=token_exchange_failed`
      );
    }

    const tokens = await tokenResponse.json();

    // Fetch user profile from userinfo endpoint
    const userInfoResponse = await fetch(
      `${process.env.OAUTH_ISSUER}/oauth2/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      console.error("Failed to fetch user info:", userInfoResponse.status);
      cleanupOAuthCookies();
      return NextResponse.redirect(
        `${appUrl}/${locale}/login?error=userinfo_failed`
      );
    }

    const userInfo = await userInfoResponse.json();

    // Create session
    const sessionData = {
      user: {
        id: userInfo.sub,
        name: userInfo.name || userInfo.preferred_username || "User",
        email: userInfo.email || "",
        image: userInfo.picture,
        roles: userInfo.roles || [],
        permissions: userInfo.permissions || [],
      },
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    };

    await createSession(sessionData);

    // Clean up OAuth cookies
    cleanupOAuthCookies();

    // Redirect to callback URL
    return NextResponse.redirect(`${appUrl}${callbackUrl}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    cleanupOAuthCookies();
    return NextResponse.redirect(
      `${appUrl}/${locale}/login?error=unexpected_error`
    );
  }
}
