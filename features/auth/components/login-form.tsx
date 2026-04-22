"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { icons } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/use-auth.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link as LinkIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { loginAction } from "../actions/auth.actions"
import {
  passkeyAuthenticateBeginAction,
  passkeyAuthenticateCompleteAction,
} from "../actions/passkey.actions"
import {
  encodeCredential,
  normalizeRequestOptions,
  PublicKeyCredentialRequestOptionsJSON,
} from "../lib/passkey-client"

const getFormSchema = (t: any) =>
  z.object({
    identifier: z.string().min(1, { message: t("identifierRequired") }),
    password: z.string().min(8, { message: t("passwordMinLength") }),
  })

// Used purely for type inference
const staticSchemaForTypes = z.object({
  identifier: z.string(),
  password: z.string(),
})

type FormValues = z.infer<typeof staticSchemaForTypes>

export function LoginForm({
  className,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit">) {
  const t = useTranslations("auth.validation")
  const [isLoading, setIsLoading] = useState(false)
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getFormSchema(t)),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      const response = await loginAction({
        identifier: data.identifier,
        password: data.password,
      })

      if (response && response.access_token) {
        // Since backend doesn't return full user info on login, mock the user data temporarily
        const decodedPayload = response.access_token.split(".")[1]
        let sub = data.identifier
        try {
          if (decodedPayload) {
            const payloadObj = JSON.parse(atob(decodedPayload))
            if (payloadObj.sub) sub = payloadObj.sub
          }
        } catch (e) {
          // ignore parsing error
        }

        // We do NOT set document.cookie manually here because loginAction handles Secure HttpOnly Session cookie
        setAuth({ id: sub, email: sub, name: sub }, response.access_token)
        toast.success("Login successful")
        router.push("/")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  const onPasskeyLogin = async () => {
    setIsPasskeyLoading(true)
    try {
      if (!("credentials" in navigator) || !navigator.credentials) {
        throw new Error("Passkey is not supported on this device/browser")
      }

      const identifier =
        (
          document.getElementById("identifier") as HTMLInputElement | null
        )?.value?.trim() ?? ""

      const begin = await passkeyAuthenticateBeginAction(
        identifier.length > 0 ? identifier : undefined
      )

      // Yubico's AssertionRequest.toJson() wraps options inside "publicKeyCredentialRequestOptions"
      const rawOptions = begin.options as unknown as Record<string, unknown>
      const requestOptions = (rawOptions.publicKeyCredentialRequestOptions ??
        rawOptions) as unknown as PublicKeyCredentialRequestOptionsJSON
      const publicKey = normalizeRequestOptions(requestOptions)

      const credential = (await navigator.credentials.get({
        publicKey,
      })) as PublicKeyCredential | null

      if (!credential) {
        throw new Error("No credential returned")
      }

      const complete = await passkeyAuthenticateCompleteAction({
        session_key: begin.session_key,
        credential: encodeCredential(credential, false),
      })

      const decodedPayload = complete.access_token.split(".")[1]
      let sub = identifier || "User"
      try {
        if (decodedPayload) {
          const payloadObj = JSON.parse(atob(decodedPayload))
          if (payloadObj.sub) sub = payloadObj.sub
        }
      } catch {}

      setAuth({ id: sub, email: sub, name: sub }, complete.access_token)
      toast.success("Login successful")
      router.push("/")
    } catch (error: any) {
      toast.error(error.message || "Failed to login with passkey")
    } finally {
      setIsPasskeyLoading(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email or username below to login
          </p>
        </div>
        <Field data-invalid={!!errors.identifier}>
          <FieldLabel htmlFor="identifier">Email / Username</FieldLabel>
          <Input
            id="identifier"
            type="text"
            placeholder="m@example.com or username"
            disabled={isLoading}
            {...register("identifier")}
          />
          <FieldError errors={[errors.identifier]} />
        </Field>
        <Field data-invalid={!!errors.password}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            disabled={isLoading}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={isLoading || isPasskeyLoading}
              onClick={onPasskeyLogin}
            >
              {isPasskeyLoading ? "Opening Passkey..." : "Login with Passkey"}
            </Button>
            <Button variant="outline" type="button" disabled={isLoading}>
              <Image
                src={icons.google}
                alt="Google"
                width={16}
                height={16}
                className="mr-2 dark:invert"
              />
              Login with Google
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              asChild
            >
              <Link
                href="/magic-link"
                className="flex items-center justify-center"
              >
                <LinkIcon className="h-4 w-4" />
                Login with Magic Link
              </Link>
            </Button>
          </div>
          <FieldDescription className="mt-2 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
