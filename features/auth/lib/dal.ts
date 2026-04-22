import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { getSession } from "./session"

export interface SessionPayload {
  token: string
  isAnonymous: boolean
}

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const token = await getSession()

  if (!token) {
    redirect("/login")
  }

  return { token, isAnonymous: false }
})

export const getOptionalSession = cache(
  async (): Promise<SessionPayload | null> => {
    const token = await getSession()
    if (!token) return null
    return { token, isAnonymous: false }
  }
)
