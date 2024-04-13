"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { LuArrowLeft } from "react-icons/lu";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import DivSlide from "@/components/shared/Animation/DivSlide";
import { verifiForgotPasswordCodeSchema } from "@/schemas/zod/auth/verifi-forgot-password-code.schema";
import { verifiResetPasswordCode } from "@/actions/auth/verifi-reset-password-code.action";

type IProps = {
  email: string | null;
  setVerification: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
};

const VerificationForgotPassword: React.FC<IProps> = ({
  email,
  setVerification,
}) => {
  const [isPending, startTransiton] = React.useTransition();

  if (!email) {
    setVerification(0);
    toast.warning("Không tìm thấy email");
  }

  const verificationForgotPassword = useForm<
    z.infer<typeof verifiForgotPasswordCodeSchema>
  >({
    resolver: zodResolver(verifiForgotPasswordCodeSchema),
    defaultValues: {
      email: email!,
    },
  });

  function onSubmitVerificationCode(
    values: z.infer<typeof verifiForgotPasswordCodeSchema>
  ) {
    startTransiton(async () => {
      const res = await verifiResetPasswordCode(values);

      if (!res.data || res.data.result === false) {
        toast.warning("Xác thực không thành công", {
          description: "Có thể code của bạn đã hết thời hạn sử dụng.",
        });

        setVerification(0);
        return;
      }

      setVerification(2);
    });
  }

  return (
    <Form {...verificationForgotPassword}>
      <form
        onSubmit={verificationForgotPassword.handleSubmit(
          onSubmitVerificationCode
        )}
        className="w-full max-w-lg min-w-96 flex flex-col items-center"
      >
        <FormField
          control={verificationForgotPassword.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <DivSlide key={"back-btn"}>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  rounded={"full"}
                  className="size-7 mr-2"
                  onClick={() => setVerification(0)}
                >
                  <LuArrowLeft />
                </Button>
                <FormLabel>Email: {email}</FormLabel>
              </DivSlide>

              <FormControl>
                <InputOTP maxLength={6} onChange={(e) => field.onChange(e)}>
                  <InputOTPGroup>
                    <DivSlide key={"InputOTPSlot-1"} delay={0.05}>
                      <InputOTPSlot index={0} />
                    </DivSlide>
                    <DivSlide key={"InputOTPSlot-2"} delay={0.1}>
                      <InputOTPSlot index={1} />
                    </DivSlide>
                    <DivSlide key={"InputOTPSlot-3"} delay={0.15}>
                      <InputOTPSlot index={2} />
                    </DivSlide>
                  </InputOTPGroup>
                  <DivSlide key={"InputOTPSlot-InputOTPSeparator"} delay={0.22}>
                    <InputOTPSeparator />
                  </DivSlide>
                  <InputOTPGroup>
                    <DivSlide key={"InputOTPSlot-4"} delay={0.2}>
                      <InputOTPSlot index={3} />
                    </DivSlide>
                    <DivSlide key={"InputOTPSlot-5"} delay={0.25}>
                      <InputOTPSlot index={4} />
                    </DivSlide>
                    <DivSlide key={"InputOTPSlot-6"} delay={0.3}>
                      <InputOTPSlot index={5} />
                    </DivSlide>
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <DivSlide key={"verification-FormDescription"} delay={0.3}>
                <FormDescription>
                  Vui lòng nhập code đã được gửi qua email.
                </FormDescription>
              </DivSlide>
              <FormMessage />
            </FormItem>
          )}
        />

        <DivSlide
          key={"verification-submit"}
          delay={0.35}
          className="flex justify-center"
        >
          <Button type="submit" className="mt-3" rounded={"full"}>
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Xác thực
          </Button>
        </DivSlide>
      </form>
    </Form>
  );
};

export default VerificationForgotPassword;
