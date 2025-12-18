"use client";

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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateSePayConfigAction } from "../actions";
import { SePayConfig } from "../types";

const formSchema = z.object({
  apiToken: z.string().min(1, "API Token is required"),
  accountNumber: z.string().min(1, "Account Number is required"),
  bankName: z.string().min(1, "Bank Name is required"),
  accountName: z.string().min(1, "Account Name is required"),
});

interface SePayConfigFormProps {
  initialData: SePayConfig;
}

export function SePayConfigForm({ initialData }: SePayConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SePayConfig>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: SePayConfig) {
    setIsSubmitting(true);
    try {
      await updateSePayConfigAction(values);
      toast.success("Configuration updated successfully");
    } catch (error) {
      toast.error("Failed to update configuration");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="apiToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SePay API Token</FormLabel>
              <FormControl>
                <Input type="password" placeholder="sk_..." {...field} />
              </FormControl>
              <FormDescription>
                Your secret API token from SePay Dashboard. Used for validating
                webhooks.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="MBBank, VCB..." {...field} />
                </FormControl>
                <FormDescription>
                  Bank Short Name (e.g. MB, VCB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="NGUYEN VAN A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Configuration
        </Button>
      </form>
    </Form>
  );
}
