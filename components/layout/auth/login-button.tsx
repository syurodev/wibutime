"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface LoginButtonProps {
  children?: React.ReactNode
  className?: string
}

export function LoginButton({ children, className }: LoginButtonProps) {
  return (
    <Button
      onClick={() => signIn("oidc")}
      className={className}
    >
      {children || "Sign In"}
    </Button>
  )
}