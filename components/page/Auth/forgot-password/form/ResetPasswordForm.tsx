"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { resetPasswordSchema } from "@/schemas/zod/auth/reset-password.schema";
import { resetPassword } from "@/actions/auth/reset-password.action";
import DivSlide from "@/components/shared/Animation/DivSlide";

type IProps = {
  email: string | null;
  setVerification: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
};

const ResetPasswordForm: React.FC<IProps> = ({ email, setVerification }) => {
  const router = useRouter();
  const [isPending, startTransiton] = React.useTransition();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email ?? "",
      password: "",
    },
  });

  if (!email) {
    setVerification(0);
    toast.warning("Không tìm thấy email");
    return;
  }

  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    startTransiton(async () => {
      const res = await resetPassword(values);

      if (!res.data || res.data.result === false) {
        toast.warning("Đặt lại mật khẩu không thành công, vui lòng thử lại!");

        setVerification(0);
        return;
      }

      toast.success("Đặt lại mật khẩu thành công!");
      router.push("?page=login");
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <DivSlide>
                <FormLabel>Mật khẩu mới</FormLabel>
              </DivSlide>
              <FormControl>
                <DivSlide delay={0.05}>
                  <Input
                    placeholder="******"
                    minLength={6}
                    {...field}
                    type="password"
                  />
                </DivSlide>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DivSlide className="flex justify-center" delay={0.1}>
          <Button type="submit" className="mt-3" rounded={"full"}>
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Đặt lại mật khẩu
          </Button>
        </DivSlide>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
