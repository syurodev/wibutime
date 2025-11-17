import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { cookies } from "next/headers";

export async function proxy(request: NextRequest) {
  // Step 1: Handle i18n routing
  const handleI18nRouting = createMiddleware(routing);
  const i18nResponse = handleI18nRouting(request);

  // Step 2: Handle authentication
  // Optimistic check: just check if session cookie exists
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/library", "/profile", "/editor-demo"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.includes(route)
  );

  // Redirect to sign in if accessing protected route without authentication
  if (isProtectedRoute && !sessionCookie) {
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return i18nResponse;
}

export const config = {
  // Match only internationalized pathnames
  // Exclude: API routes, _next, static files
  matcher: ["/", "/(vi|en)/:path*"],
};
