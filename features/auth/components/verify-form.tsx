"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { api } from "@/lib/api"
import { endpoints } from "@/lib/endpoints"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Loader2, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const getFormSchema = (t: any) =>
  z.object({
    otp: z.string().length(6, { message: t("otpLength") }),
  })

const staticSchemaForTypes = z.object({
  otp: z.string(),
})

type FormValues = z.infer<typeof staticSchemaForTypes>

function VerifyFormContent({
  className,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit">) {
  const t = useTranslations("auth.validation")
  const tAuth = useTranslations("auth")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const userId = searchParams.get("user_id") || ""

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getFormSchema(t)),
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      await api.post<{
        email: string
        id: string
        name: string
      }>(endpoints.auth.verifyOtp, {
        email,
        user_id: userId,
        otp: data.otp,
      })

      toast.success("Account verified successfully")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{tAuth("verifyOtp")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {tAuth("otpDescription")}
          </p>
        </div>

        <Field
          data-invalid={!!errors.otp}
          className="mx-auto w-fit items-center"
        >
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <InputOTP
                id="digits-only"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                {...field}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className="text-sm font-medium text-destructive">
              {errors.otp.message}
            </p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="size-4" />
                {tAuth("verifyAction")}
              </>
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export function VerifyForm(
  props: Omit<React.ComponentProps<"form">, "onSubmit">
) {
  return (
    <Suspense
      fallback={<div className="flex justify-center p-4">Loading...</div>}
    >
      <VerifyFormContent {...props} />
    </Suspense>
  )
}
