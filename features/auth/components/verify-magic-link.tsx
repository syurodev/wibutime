"use client"

import { useAuthStore } from "@/stores/use-auth.store"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { verifyMagicLinkAction } from "../actions/auth.actions"
import { Loader2 } from "lucide-react"

interface VerifyMagicLinkProps {
  token: string
}

export function VerifyMagicLink({ token }: VerifyMagicLinkProps) {
  const tAuth = useTranslations("auth")
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const verify = async () => {
      try {
        const response = await verifyMagicLinkAction(token)

        if (response && response.access_token) {
          // Since backend doesn't return full user info on login, mock the user data temporarily
          const decodedPayload = response.access_token.split(".")[1]
          let sub = "User"
          try {
            if (decodedPayload) {
              const payloadObj = JSON.parse(atob(decodedPayload))
              if (payloadObj.sub) sub = payloadObj.sub
            }
          } catch (e) {
            // ignore parsing error
          }

          if (isMounted) {
            setAuth({ id: sub, email: sub, name: sub }, response.access_token)
            toast.success("Login successful")
            router.push("/")
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Invalid or expired magic link")
          toast.error(err.message || "Invalid or expired magic link")
        }
      }
    }

    verify()

    return () => {
      isMounted = false
    }
  }, [token, router, setAuth])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-destructive font-medium">{error}</div>
        <button 
          onClick={() => router.push("/login")}
          className="text-sm underline hover:text-primary"
        >
          Back to login
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h2 className="text-lg font-medium">{tAuth("verifyingMagicLink") || "Verifying..."}</h2>
      <p className="text-sm text-muted-foreground">Please wait while we log you in.</p>
    </div>
  )
}
