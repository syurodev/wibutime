import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // Check if access token is expired or about to expire (within 5 minutes)
  const isExpired = session.expiresAt < Date.now() + 5 * 60 * 1000;

  return NextResponse.json({
    user: session.user,
    accessToken: session.accessToken,
    isExpired,
  });
}
