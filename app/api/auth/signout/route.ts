import { deleteSession, getSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getSession();

  // Delete Next.js session
  await deleteSession();

  // Revoke tokens at OAuth server (optional but recommended)
  if (session?.accessToken) {
    try {
      await fetch(`${process.env.OAUTH_ISSUER}/oauth2/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          token: session.accessToken,
          client_id: process.env.OAUTH_CLIENT_ID!,
          client_secret: process.env.OAUTH_CLIENT_SECRET!,
        }),
      });
    } catch (error) {
      console.error("Failed to revoke token:", error);
      // Continue logout even if revoke fails
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  await deleteSession();

  // Redirect to OAuth server logout to clear session_id cookie
  const logoutUrl = new URL(`${process.env.OAUTH_ISSUER}/oauth2/logout`);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  logoutUrl.searchParams.set("post_logout_redirect_uri", appUrl);

  // Add state for security
  const state = crypto.randomUUID();
  logoutUrl.searchParams.set("state", state);

  return NextResponse.redirect(logoutUrl.toString());
}
