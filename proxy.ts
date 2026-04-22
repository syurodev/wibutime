import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const handleI18n = createMiddleware(routing)

const protectedPaths = ["/profile", "/settings", "/watch-history"]
const authPaths = ["/login", "/register", "/verify", "/magic-link"]
const LEGACY_SESSION_COOKIE = "session_token"

function looksLikeJwt(token: string): boolean {
  return token.split(".").length === 3
}

function getLocaleFromPath(pathname: string): string {
  const segment = pathname.split("/")[1]
  return routing.locales.includes(segment as never) ? segment : routing.defaultLocale
}

function stripLocale(pathname: string, locale: string): string {
  return pathname.startsWith(`/${locale}`) ? pathname.slice(locale.length + 1) || "/" : pathname
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("access_token")?.value
  const legacySession = request.cookies.get(LEGACY_SESSION_COOKIE)?.value

  // One-time migration: older versions stored access_token in session_token.
  // If it looks like JWT, treat as auth token.
  const effectiveAccessToken =
    accessToken ?? (legacySession && looksLikeJwt(legacySession) ? legacySession : undefined)

  const locale = getLocaleFromPath(pathname)
  const pathWithoutLocale = stripLocale(pathname, locale)

  const isProtected = protectedPaths.some((p) => pathWithoutLocale.startsWith(p))
  const isAuthPage = authPaths.some((p) => pathWithoutLocale.startsWith(p))

  if (isProtected && !effectiveAccessToken) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && effectiveAccessToken) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  const response = handleI18n(request)

  // Best-effort cookie migration without extra roundtrip.
  if (!accessToken && legacySession && looksLikeJwt(legacySession)) {
    response.cookies.set("access_token", legacySession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
