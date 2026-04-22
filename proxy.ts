import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const handleI18n = createMiddleware(routing)

const protectedPaths = ["/profile", "/settings", "/watch-history"]
const authPaths = ["/login", "/register", "/verify"]

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

  const locale = getLocaleFromPath(pathname)
  const pathWithoutLocale = stripLocale(pathname, locale)

  const isProtected = protectedPaths.some((p) => pathWithoutLocale.startsWith(p))
  const isAuthPage = authPaths.some((p) => pathWithoutLocale.startsWith(p))

  if (isProtected && !accessToken) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  return handleI18n(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
