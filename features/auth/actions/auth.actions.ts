"use server"

import { endpoints } from "@/lib/endpoints"
import { redirect } from "next/navigation"
import {
  deleteAccessToken,
  deleteRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../lib/session"
import { LoginResponse } from "@/types/auth"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080"

interface LoginCredentials {
  identifier: string
  password: string
}

export async function loginAction(credentials: LoginCredentials): Promise<LoginResponse> {
  if (!credentials.identifier || !credentials.password) {
    throw new Error("Identifier and password are required")
  }

  const res = await fetch(`${BACKEND_URL}${endpoints.auth.login}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })

  // Parse backend error message if possible
  if (!res.ok) {
    let errorMessage = "Invalid email or password"
    try {
      const errorData = await res.json()
      if (errorData && errorData.message) errorMessage = errorData.message
    } catch (e) {
      // Ignore json parse error
    }
    throw new Error(errorMessage)
  }

  const data = (await res.json()) as LoginResponse
  await setAccessToken(data.access_token)
  await setRefreshToken(data.refresh_token)
  
  // Cleanly return the access_token and other details back to the client
  return data
}

export async function logout(): Promise<void> {
  await deleteAccessToken()
  await deleteRefreshToken()
  redirect("/login")
}

export async function sendMagicLinkAction(email: string, callbackUrl: string): Promise<void> {
  if (!email) {
    throw new Error("Email is required")
  }

  const res = await fetch(`${BACKEND_URL}${endpoints.auth.magicLinkSend}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, callback_url: callbackUrl }),
  })

  if (!res.ok) {
    let errorMessage = "Failed to send magic link"
    try {
      const errorData = await res.json()
      if (errorData && errorData.message) errorMessage = errorData.message
    } catch (e) {
      // Ignore json parse error
    }
    throw new Error(errorMessage)
  }
}

export async function verifyMagicLinkAction(token: string): Promise<LoginResponse> {
  if (!token) {
    throw new Error("Token is required")
  }

  const res = await fetch(`${BACKEND_URL}${endpoints.auth.magicLinkVerify}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })

  if (!res.ok) {
    let errorMessage = "Invalid or expired magic link"
    try {
      const errorData = await res.json()
      if (errorData && errorData.message) errorMessage = errorData.message
    } catch (e) {
      // Ignore json parse error
    }
    throw new Error(errorMessage)
  }

  const data = (await res.json()) as LoginResponse
  await setAccessToken(data.access_token)
  await setRefreshToken(data.refresh_token)
  
  return data
}
