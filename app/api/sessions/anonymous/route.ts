import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { endpoints } from "@/lib/endpoints"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080"
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

interface AnonymousSessionRequest {
  user_agent: string
  language: string
  timezone: string
  screen_resolution: string
  platform: string
}

interface AnonymousSessionResponse {
  session_token: string
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AnonymousSessionRequest

  const client_ip = getClientIp(request)

  const res = await fetch(`${BACKEND_URL}${endpoints.sessions.anonymous}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_ip,
      user_agent: body.user_agent,
      language: body.language,
      timezone: body.timezone,
      screen_resolution: body.screen_resolution,
      platform: body.platform,
    }),
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to create anonymous session" },
      { status: res.status }
    )
  }

  const data = (await res.json()) as AnonymousSessionResponse

  const cookieStore = await cookies()
  cookieStore.set("session_token", data.session_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })

  return NextResponse.json({ success: true })
}
