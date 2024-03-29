'use client'

import { FC, useTransition } from 'react'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc";

import { registerSchema } from '@/schemas/auth'
import { register } from '@/actions/register'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import CardWrapper from '../CardWrapper'

const RegisterForm: FC = () => {
  const [isPending, startTransiton] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      name: ""
    },
  })

  function onSubmit(values: z.infer<typeof registerSchema>) {
    startTransiton(async () => {
      const res = await register(values)

      if (res.code !== 200) {
        toast.error(res.message)
      } else {
        toast.success(res.message, {
          description: res.submess,
          action: {
            label: "Đăng nhập",
            onClick: () => router.push("/auth/login")
          },
        })

        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      }
    })
  }

  return (
    <CardWrapper
      bottomHref='/auth/login'
      bottomHrefLabel='Đăng nhập'
      bottomLabel='Đã có tài khoản?'
      label='Welcome'
      subLabel='Đăng ký tài khoản mới'
    >
      <div className='flex flex-col gap-9 w-full'>
        <Button variant={"outline"} rounded={"full"} className='flex items-center gap-3' size={"lg"}>
          <FcGoogle className="text-lg" /> Đăng ký với Google
        </Button>

        <hr />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên<span className='text-destructive'>*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Jame" disabled={isPending} {...field} />
                  </FormControl>
                  <FormDescription>
                    Tên sẽ được hiển thị thay thế cho tên đăng nhập.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email<span className='text-destructive'>*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập<span className='text-destructive'>*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="username" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu<span className='text-destructive'>*</span></FormLabel>
                  <FormControl>
                    <Input {...field} type='password' placeholder='******' disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu<span className='text-destructive'>*</span></FormLabel>
                  <FormControl>
                    <Input {...field} type='password' placeholder='******' disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size={"lg"}
              rounded={"full"}
              disabled={isPending}
            >
              {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Đăng ký
            </Button>
          </form>
        </Form>
      </div>
    </CardWrapper>
  )
}

export default RegisterForm