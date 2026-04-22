import "server-only"
import { cookies } from "next/headers"

const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function getSession(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get("session_token")?.value
}

export async function setSession(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session_token")
}
