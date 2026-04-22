import "server-only"
import { cookies } from "next/headers"

const DEVICE_TOKEN_COOKIE = "device_token"
const ACCESS_TOKEN_COOKIE = "access_token"
const REFRESH_TOKEN_COOKIE = "refresh_token"
const LEGACY_SESSION_COOKIE = "session_token"

const DEVICE_TOKEN_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days (matches backend refresh-token-expiry)

function looksLikeJwt(token: string): boolean {
  // Heuristic: JWT is 3 base64url-ish segments separated by dots.
  // Device/anonymous tokens are typically UUID/random and don't match this.
  return token.split(".").length === 3
}

export async function getDeviceToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const device = cookieStore.get(DEVICE_TOKEN_COOKIE)?.value
  if (device) return device

  const legacy = cookieStore.get(LEGACY_SESSION_COOKIE)?.value
  if (legacy && !looksLikeJwt(legacy)) return legacy

  return undefined
}

export async function setDeviceToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(DEVICE_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: DEVICE_TOKEN_MAX_AGE,
    path: "/",
  })
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const access = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
  if (access) return access

  const legacy = cookieStore.get(LEGACY_SESSION_COOKIE)?.value
  if (legacy && looksLikeJwt(legacy)) return legacy

  return undefined
}

export async function setAccessToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: "/",
  })
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value
}

export async function setRefreshToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/",
  })
}

export async function deleteAccessToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
}

export async function deleteRefreshToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
}

export async function deleteDeviceToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(DEVICE_TOKEN_COOKIE)
}

export async function deleteLegacySessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(LEGACY_SESSION_COOKIE)
}
