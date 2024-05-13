"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";
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
import { Button } from "@/components/ui/button";

import { forgotPasswordSchema } from "@/schemas/zod/auth/forgot-password.schema";
import DivSlide from "@/components/shared/Animation/DivSlide";
import { sendResetPasswordRequest } from "@/actions/auth/send-reset-password-request.action";

type IProps = {
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  setVerification: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
};

const SendForgotPasswordVerficationCode: React.FC<IProps> = ({
  setEmail,
  setVerification,
}) => {
  const [isPending, startTransiton] = React.useTransition();

  const sendResetPasswordRequestForm = useForm<
    z.infer<typeof forgotPasswordSchema>
  >({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setEmail(values.email);
    startTransiton(async () => {
      const res = await sendResetPasswordRequest(values);

      if (!res.data || res.data.result === false) {
        toast.warning("Gửi code không thành công", {
          description: "Có thể nguyên nhân là do email bạn nhập không tồn tại.",
        });

        return;
      }

      setVerification(1);
    });
  }

  return (
    <Form {...sendResetPasswordRequestForm}>
      <form
        onSubmit={sendResetPasswordRequestForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full"
      >
        <FormField
          control={sendResetPasswordRequestForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <DivSlide key={"send-label"}>
                <FormLabel>
                  Email<span className="text-destructive">*</span>
                </FormLabel>
              </DivSlide>
              <FormControl>
                <DivSlide key={"send-input"} delay={0.05}>
                  <Input
                    placeholder="example@example.com"
                    disabled={isPending}
                    {...field}
                  />
                </DivSlide>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DivSlide
          key={"send-verification-submit"}
          delay={0.1}
          className="flex justify-center"
        >
          <Button
            type="submit"
            size={"lg"}
            rounded={"full"}
            disabled={isPending}
          >
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Yêu cầu đặt lại mật khẩu
          </Button>
        </DivSlide>
      </form>
    </Form>
  );
};

export default SendForgotPasswordVerficationCode;
