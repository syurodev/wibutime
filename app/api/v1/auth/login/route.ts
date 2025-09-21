import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const redirectUri = searchParams.get("redirect_uri");

    // Redirect to our custom login page with the redirect_uri
    const loginUrl = new URL("/auth/login", request.url);
    if (redirectUri) {
        loginUrl.searchParams.set("redirect_uri", redirectUri);
    }

    return NextResponse.redirect(loginUrl);
}
