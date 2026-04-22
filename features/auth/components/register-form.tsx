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
import { api } from "@/lib/api"
import { endpoints } from "@/lib/endpoints"
import { icons } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const getFormSchema = (t: any) =>
  z.object({
    name: z.string().min(1, { message: t("nameRequired") }),
    email: z.email({ message: t("emailInvalid") }),
    password: z.string().min(8, { message: t("passwordMinLength") }),
  })

const staticSchemaForTypes = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
})

type FormValues = z.infer<typeof staticSchemaForTypes>

export function RegisterForm({
  className,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit">) {
  const t = useTranslations("auth.validation")
  const tAuth = useTranslations("auth")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getFormSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      const response = await api.post<{
        user_id: string
        email: string
      }>(endpoints.auth.register, {
        name: data.name,
        email: data.email,
        password: data.password,
      })

      toast.success("Account created successfully")
      // Send user to verification page
      router.push(
        `/verify?email=${encodeURIComponent(response.email)}&user_id=${encodeURIComponent(response.user_id)}`
      )
    } catch (error: any) {
      toast.error(error.message || "Failed to register")
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
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your details below to create an account
          </p>
        </div>

        <Field data-disabled={isLoading} data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">{tAuth("name")}</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            disabled={isLoading}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-disabled={isLoading} data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">{tAuth("email")}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-disabled={isLoading} data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">{tAuth("password")}</FieldLabel>
          <Input
            id="password"
            type="password"
            disabled={isLoading}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : tAuth("register")}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" disabled={isLoading}>
            <Image
              src={icons.google}
              alt="Google"
              width={16}
              height={16}
              className="dark:invert"
            />
            {tAuth("register")} with Google
          </Button>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-4">
              {tAuth("login")}
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
