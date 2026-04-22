"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { sendMagicLinkAction } from "../actions/auth.actions"

const getFormSchema = (t: any) =>
  z.object({
    email: z
      .email({ message: t("emailInvalid") })
      .min(1, { message: t("emailRequired") }),
  })

const staticSchemaForTypes = z.object({
  email: z.email(),
})

type FormValues = z.infer<typeof staticSchemaForTypes>

export function MagicLinkForm({
  className,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit">) {
  const t = useTranslations("auth.validation")
  const tAuth = useTranslations("auth")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getFormSchema(t)),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      const callbackUrl = `${window.location.origin}${window.location.pathname}`
      await sendMagicLinkAction(data.email, callbackUrl)
      setIsSuccess(true)
      toast.success(
        tAuth("magicLinkSentMessage") ||
          "A magic link has been sent to your email."
      )
    } catch (error: any) {
      toast.error(error.message || "Failed to send magic link")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="mb-2 flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">
          {tAuth("magicLinkLoginTitle") || "Login with Magic Link"}
        </h1>
        <p className="mt-2 text-sm text-balance text-muted-foreground">
          {tAuth("magicLinkLoginDesc") ||
            "Enter your email. We'll send you a link to login."}
        </p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} {...props}>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">
                {tAuth("email") || "Email"}
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                disabled={isLoading}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? tAuth("sending") || "Sending..."
                  : tAuth("sendMagicLink") || "Send Magic Link"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      ) : (
        <div className="flex flex-col gap-3 rounded-md border bg-muted/50 p-4 text-center">
          <p className="text-sm font-medium">Check your email</p>
          <p className="text-sm text-muted-foreground">
            We sent a login link to you. Click the link inside to get started.
          </p>
        </div>
      )}

      <div className="mt-4 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  )
}
