import "server-only"

import { endpoints } from "@/lib/endpoints"
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./session"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080"

interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

/**
 * Attempt to refresh the session using the stored refresh token.
 * On success, new access & refresh tokens are persisted in httpOnly cookies.
 * On failure, both tokens are cleared so the user is forced to re-login.
 */
async function refreshSession(): Promise<boolean> {
  const refreshToken = await getRefreshToken()
  if (!refreshToken) {
    console.log("[auth-fetch] refreshSession: no refresh_token cookie — skip")
    return false
  }

  console.log("[auth-fetch] refreshSession: attempting token refresh...")

  try {
    const res = await fetch(`${BACKEND_URL}${endpoints.auth.refresh}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!res.ok) {
      console.log(`[auth-fetch] refreshSession: backend returned ${res.status} — clearing tokens`)
      // Refresh token is invalid or expired — clear everything
      await deleteAccessToken()
      await deleteRefreshToken()
      return false
    }

    const data = (await res.json()) as RefreshTokenResponse
    await setAccessToken(data.access_token)
    await setRefreshToken(data.refresh_token)
    console.log(`[auth-fetch] refreshSession: success — new access_token expires_in=${data.expires_in}s`)
    return true
  } catch (err) {
    console.error("[auth-fetch] refreshSession: exception", err)
    return false
  }
}

/**
 * A fetch wrapper that replaces Axios interceptors for Server Actions.
 *
 * Automatically:
 * 1. Attaches `Authorization: Bearer <token>` from the httpOnly cookie
 * 2. On 401 response, tries to refresh the token and retries once
 *
 * Usage in server actions:
 * ```ts
 * const res = await authFetch(`${BACKEND_URL}/api/v1/some/endpoint`, {
 *   method: "GET",
 * })
 * ```
 *
 * This works because all backend calls go through Server Actions (server-side),
 * so we have full access to httpOnly cookies — no client-side exposure.
 */
export async function authFetch(
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url
  const method = init?.method ?? "GET"
  const access = await getAccessToken()
  const headers = new Headers(init?.headers)

  console.log(`[auth-fetch] ${method} ${url} — access_token=${access ? "present" : "missing"}`)

  if (access) {
    headers.set("Authorization", `Bearer ${access}`)
  }

  let res = await fetch(input, { ...init, headers })
  console.log(`[auth-fetch] ${method} ${url} → ${res.status}`)

  // On 401, attempt token refresh and retry once
  if (res.status === 401) {
    console.log(`[auth-fetch] 401 detected — attempting refresh + retry`)
    const refreshed = await refreshSession()
    if (refreshed) {
      const newAccess = await getAccessToken()
      if (newAccess) {
        headers.set("Authorization", `Bearer ${newAccess}`)
        res = await fetch(input, { ...init, headers })
        console.log(`[auth-fetch] retry ${method} ${url} → ${res.status}`)
      }
    } else {
      console.log(`[auth-fetch] refresh failed — returning 401`)
    }
  }

  return res
}
