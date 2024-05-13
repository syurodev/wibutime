"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { verificationEmailSchema } from "@/schemas/zod/auth/verification-email.schema";
import DivSlide from "@/components/shared/Animation/DivSlide";
import { verifiEmailCode } from "@/actions/auth/verification-email";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { PenSquare, X } from "lucide-react";

type IProps = {
  email: string | null;
};

const VerificationForm: React.FC<IProps> = ({ email }) => {
  const router = useRouter();
  const [isPending, startTransiton] = React.useTransition();
  const [disableEmailInput, setDisableEmailInput] =
    React.useState<boolean>(true);

  // if (!email) {
  //   router.push("?page=register");
  // }

  const form = useForm<z.infer<typeof verificationEmailSchema>>({
    resolver: zodResolver(verificationEmailSchema),
    defaultValues: {
      email: email ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof verificationEmailSchema>) {
    startTransiton(async () => {
      const res = await verifiEmailCode(data);

      if (res.status !== 200) {
        toast.warning(res.message);

        return;
      }

      toast.success(res.message);
      setTimeout(() => {
        router.push("?page=login");
      }, 2000);
    });
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-lg min-w-96 flex flex-col items-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-[257px] mb-3">
                <DivSlide className="flex items-center justify-between">
                  <FormLabel>Email</FormLabel>
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
                    <DivSlide
                      key={"InputOTPSlot-InputOTPSeparator"}
                      delay={0.3}
                    >
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

          <DivSlide delay={0.55} className="flex justify-center mt-3">
            <Button type="submit" rounded={"full"}>
              {isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xác thực
            </Button>
          </DivSlide>
        </form>
      </Form>
    </div>
  );
};

export default VerificationForm;
