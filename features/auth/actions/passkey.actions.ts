"use server"

import { setAccessToken, setRefreshToken } from "@/features/auth/lib/session"
import { authFetch } from "@/features/auth/lib/auth-fetch"
import { endpoints } from "@/lib/endpoints"
import { LoginResponse } from "@/types/auth"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080"

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

export interface PasskeyLoginBeginResponse {
  session_key: string
  options: Json
}

export async function passkeyAuthenticateBeginAction(
  email?: string
): Promise<PasskeyLoginBeginResponse> {
  const body = email ? { email } : {}

  const res = await fetch(
    `${BACKEND_URL}${endpoints.auth.passkey.authenticateBegin}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    let message = "Failed to begin passkey authentication"
    try {
      const data = (await res.json()) as { message?: string }
      if (data?.message) message = data.message
    } catch {}
    throw new Error(message)
  }

  return (await res.json()) as PasskeyLoginBeginResponse
}

export async function passkeyAuthenticateCompleteAction(input: {
  session_key: string
  credential: unknown
}): Promise<LoginResponse> {
  if (!input.session_key) throw new Error("session_key is required")
  if (!input.credential) throw new Error("credential is required")

  const res = await fetch(
    `${BACKEND_URL}${endpoints.auth.passkey.authenticateComplete}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_key: input.session_key,
        credential: input.credential,
      }),
    }
  )

  if (!res.ok) {
    let message = "Failed to complete passkey authentication"
    try {
      const data = (await res.json()) as { message?: string }
      if (data?.message) message = data.message
    } catch {}
    throw new Error(message)
  }

  const data = (await res.json()) as LoginResponse
  await setAccessToken(data.access_token)
  await setRefreshToken(data.refresh_token)
  return data
}

export interface PasskeyRegisterBeginResponse {
  options: Json
}

export async function passkeyRegisterBeginAction(input: {
  friendly_name: string
}): Promise<PasskeyRegisterBeginResponse> {
  if (!input.friendly_name) throw new Error("friendly_name is required")

  const res = await authFetch(
    `${BACKEND_URL}${endpoints.auth.passkey.registerBegin}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendly_name: input.friendly_name }),
    }
  )

  if (!res.ok) {
    let message = "Failed to begin passkey registration"
    try {
      const data = (await res.json()) as { message?: string }
      if (data?.message) message = data.message
    } catch {}
    throw new Error(message)
  }

  return (await res.json()) as PasskeyRegisterBeginResponse
}

export interface PasskeyRegisterCompleteResponse {
  credential_id: string
  friendly_name: string
  created_at: string
}

export async function passkeyRegisterCompleteAction(input: {
  credential: unknown
}): Promise<PasskeyRegisterCompleteResponse> {
  if (!input.credential) throw new Error("credential is required")

  const res = await authFetch(
    `${BACKEND_URL}${endpoints.auth.passkey.registerComplete}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: input.credential }),
    }
  )

  if (!res.ok) {
    let message = "Failed to complete passkey registration"
    try {
      const data = (await res.json()) as { message?: string }
      if (data?.message) message = data.message
    } catch {}
    throw new Error(message)
  }

  return (await res.json()) as PasskeyRegisterCompleteResponse
}

export interface PasskeyCredential {
  id: string
  friendly_name: string
  transports?: string[]
  created_at: string
  last_used_at?: string
}

export async function passkeyCredentialsAction(): Promise<PasskeyCredential[]> {
  const res = await authFetch(
    `${BACKEND_URL}${endpoints.auth.passkey.credentials}`,
    { method: "GET" }
  )

  // Not authenticated — return empty instead of crashing
  if (res.status === 401) return []

  if (!res.ok) {
    let message = "Failed to fetch passkey credentials"
    try {
      const data = (await res.json()) as { message?: string }
      if (data?.message) message = data.message
    } catch {}
    throw new Error(message)
  }

  return (await res.json()) as PasskeyCredential[]
}

export async function passkeyDeleteCredentialAction(id: string): Promise<void> {
  if (!id) throw new Error("id is required")

  const res = await authFetch(
    `${BACKEND_URL}${endpoints.auth.passkey.credentialById(id)}`,
    { method: "DELETE" }
  )

  if (!res.ok) {
    let message = "Failed to delete passkey credential"
    try {
      const data = (await res.json()) as { message?: string }
      if (data?.message) message = data.message
    } catch {}
    throw new Error(message)
  }
}
