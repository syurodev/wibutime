"use client"

import { useEffect, useRef } from "react"

export function AnonymousSessionInit() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function initAnonymousSession() {
      // Cookie is HttpOnly so JS can't read it directly.
      // We use a lightweight ping to our Route Handler which checks server-side.
      const check = await fetch("/api/sessions/check", { method: "GET" })
      if (check.ok) {
        const { hasDeviceSession } = (await check.json()) as {
          hasDeviceSession: boolean
        }
        if (hasDeviceSession) return
      }

      await fetch("/api/sessions/anonymous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_agent: navigator.userAgent,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screen_resolution: `${screen.width}x${screen.height}`,
          platform: navigator.platform,
        }),
      })
    }

    initAnonymousSession().catch(console.error)
  }, [])

  return null
}
