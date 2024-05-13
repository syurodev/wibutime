"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { registerSchema } from "@/schemas/zod/auth/register.schema";
import { register } from "@/actions/auth/register.action";
import DivSlide from "@/components/shared/Animation/DivSlide";

type IProps = {
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

const RegisterForm: React.FC<IProps> = ({ setEmail }) => {
  const [isPending, startTransiton] = React.useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    setEmail(values.email);
    startTransiton(async () => {
      const res: ServerActionResponse<UserResponse | null> = await register(
        values
      );

      if (res.status !== 200) {
        toast.warning(res.message);

        return;
      }

      toast.success("Tạo tài khoản thành công", {
        description: "Tự động chuyển trang sau 2 giây",
      });

      setTimeout(() => {
        router.push("?page=verification");
      }, 2000);
    });
  }

  return (
    <AnimatePresence mode="wait">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full max-w-lg min-w-96 relative"
        >
          <DivSlide>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên<span className="text-destructive">*</span>
                  </FormLabel>
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
          </DivSlide>

          <DivSlide delay={0.05}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@example.com"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DivSlide>

          <DivSlide delay={0.1}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên đăng nhập<span className="text-destructive">*</span>
                  </FormLabel>
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

          <DivSlide delay={0.15}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mật khẩu<span className="text-destructive">*</span>
                  </FormLabel>
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

          <DivSlide delay={0.2}>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nhập lại mật khẩu<span className="text-destructive">*</span>
                  </FormLabel>
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

          <DivSlide delay={0.25} className="flex justify-center">
            <Button
              type="submit"
              size={"lg"}
              rounded={"full"}
              disabled={isPending}
            >
              {isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Đăng ký
            </Button>
          </DivSlide>
        </form>
      </Form>
    </AnimatePresence>
  );
};

export default RegisterForm;
