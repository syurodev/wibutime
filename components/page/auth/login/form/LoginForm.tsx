"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { loginSchema } from "@/schemas/zod/auth/auth.schema";
import { login } from "@/actions/auth/login.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";
import DivSlide from "@/components/shared/Animation/DivSlide";
import { redirect } from "next/navigation";

const LoginForm = () => {
  const [isPending, startTransiton] = React.useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransiton(async () => {
      const res: ServerActionResponse<UserResponse | null> = await login(
        values
      );
      console.log(res);
      if (!res.data) {
        toast.warning("Đăng nhập không thành công!");
        return;
      }

      redirect("/");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full max-w-lg min-w-96"
      >
        <DivSlide>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đăng nhập hoặc email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </DivSlide>

        <DivSlide delay={0.05}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="******"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </DivSlide>

        <DivSlide delay={0.1} className="flex justify-end">
          <Button
            variant={"link"}
            size={"sm"}
            asChild
            className="p-0 w-fit font-medium"
          >
            <Link href={"?page=forgot-password"}>Quên mật khẩu?</Link>
          </Button>
        </DivSlide>

        <DivSlide delay={0.15} className="flex justify-center">
          <Button
            type="submit"
            size={"lg"}
            rounded={"full"}
            disabled={isPending}
          >
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Đăng nhập
          </Button>
        </DivSlide>
      </form>
    </Form>
  );
};

export default LoginForm;
