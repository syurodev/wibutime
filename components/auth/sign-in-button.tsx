"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/client";

export function SignInButton() {
  return (
    <Button onClick={() => signIn("/")} className="w-full">
      Sign in
    </Button>
  );
}
