"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { ArrowLeft, PenSquare, X } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

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
import { Input } from "@/components/ui/input";

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
  const [disableEmailInput, setDisableEmailInput] =
    React.useState<boolean>(true);

  const form = useForm<z.infer<typeof verifiForgotPasswordCodeSchema>>({
    resolver: zodResolver(verifiForgotPasswordCodeSchema),
    defaultValues: {
      email: email ?? "",
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitVerificationCode)}
        className="w-full max-w-lg min-w-96 flex flex-col items-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-[257px] mb-3">
              <DivSlide className="flex items-center justify-between">
                <div>
                  <Button
                    variant={"ghost"}
                    rounded={"full"}
                    size={"icon"}
                    className="size-8 mr-3"
                    type="button"
                  >
                    <ArrowLeft />
                  </Button>
                  <FormLabel>Email</FormLabel>
                </div>
                <Button
                  type="button"
                  variant={"outline"}
                  size={"icon"}
                  rounded={"full"}
                  className="size-8"
                  onClick={() => setDisableEmailInput(!disableEmailInput)}
                >
                  {disableEmailInput ? <PenSquare /> : <X />}
                </Button>
              </DivSlide>
              <FormControl>
                <DivSlide delay={0.05}>
                  <Input
                    placeholder="example@example.com"
                    {...field}
                    disabled={disableEmailInput}
                  />
                </DivSlide>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <DivSlide delay={0.1}>
                <FormLabel>Mã xác thực</FormLabel>{" "}
              </DivSlide>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  onChange={(e) => field.onChange(e)}
                >
                  <InputOTPGroup>
                    <DivSlide key={"InputOTPSlot-1"} delay={0.15}>
                      <InputOTPSlot index={0} />
                    </DivSlide>
                    <DivSlide key={"InputOTPSlot-2"} delay={0.2}>
                      <InputOTPSlot index={1} />
                    </DivSlide>
                    <DivSlide key={"InputOTPSlot-3"} delay={0.25}>
                      <InputOTPSlot index={2} />
                    </DivSlide>
                  </InputOTPGroup>
                  <DivSlide key={"InputOTPSlot-InputOTPSeparator"} delay={0.3}>
                    <InputOTPSeparator />
                  </DivSlide>
                  <InputOTPGroup>
                    <DivSlide key={"InputOTPSlot-4"} delay={0.35}>
                      <InputOTPSlot index={3} />
                    </DivSlide>
                    <DivSlide key={"InputOTPSlot-5"} delay={0.4}>
                      <InputOTPSlot index={4} />
                    </DivSlide>
                    <DivSlide key={"InputOTPSlot-6"} delay={0.45}>
                      <InputOTPSlot index={5} />
                    </DivSlide>
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <DivSlide delay={0.5}>
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
