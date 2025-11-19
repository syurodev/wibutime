import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Generate PKCE code verifier and challenge
 */
async function generatePKCE() {
  // Generate random code_verifier (43-128 characters, base64url)
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const codeVerifier = base64UrlEncode(randomBytes);

  // Generate code_challenge from code_verifier using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const codeChallenge = base64UrlEncode(new Uint8Array(hashBuffer));

  return { codeVerifier, codeChallenge };
}

/**
 * Base64 URL encode (RFC 4648)
 */
function base64UrlEncode(buffer: Uint8Array): string {
  // Convert to base64
  let binary = "";
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  const base64 = btoa(binary);

  // Convert to base64url
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Generate PKCE parameters
  const { codeVerifier, codeChallenge } = await generatePKCE();

  // Generate state for CSRF protection
  const state = crypto.randomUUID();

  // Store code_verifier and state in cookies for callback verification
  const cookieStore = await cookies();
  cookieStore.set("oauth_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  cookieStore.set("oauth_callback_url", callbackUrl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  // Build authorization URL
  const authorizationUrl = new URL(
    `${process.env.OAUTH_ISSUER}/oauth2/auth`
  );

  authorizationUrl.searchParams.set(
    "client_id",
    process.env.OAUTH_CLIENT_ID!
  );
  authorizationUrl.searchParams.set(
    "redirect_uri",
    `${appUrl}/api/auth/callback`
  );
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set(
    "scope",
    "openid profile email offline_access"
  );
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", codeChallenge);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");

  // Redirect to OAuth authorization endpoint
  return NextResponse.redirect(authorizationUrl.toString());
}
