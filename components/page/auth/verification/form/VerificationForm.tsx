"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { verificationOtpSchema } from "@/schemas/zod/auth/verification-otp.schema";
import { toast } from "sonner";

const VerificationForm = () => {
  const form = useForm<z.infer<typeof verificationOtpSchema>>({
    resolver: zodResolver(verificationOtpSchema),
    defaultValues: {},
  });

  function onSubmit(data: z.infer<typeof verificationOtpSchema>) {
    toast.message("You submitted the following values:", {
      description: data.code,
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã xác nhận</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} onChange={(e) => field.onChange(e)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Vui lòng nhập code đã được gửi qua email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default VerificationForm;
