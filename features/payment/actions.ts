"use server";

import { serverApi } from "@/lib/api/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SePayConfig } from "./types";

export async function updateSePayConfigAction(config: SePayConfig) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const updates = [
    {
      key: "sepay.api_token",
      value: config.apiToken,
      value_type: "string",
      is_sensitive: true,
      description: "SePay API Token",
    },
    {
      key: "sepay.account_number",
      value: config.accountNumber,
      value_type: "string",
      is_sensitive: false,
      description: "Bank Account Number",
    },
    {
      key: "sepay.bank_name",
      value: config.bankName,
      value_type: "string",
      is_sensitive: false,
      description: "Bank Name",
    },
    {
      key: "sepay.account_name",
      value: config.accountName,
      value_type: "string",
      is_sensitive: false,
      description: "Bank Account Name",
    },
  ];

  try {
    // Call Bulk Update API
    await serverApi.put(
      "/admin/payment/config",
      { configs: updates },
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
  } catch (error) {
    console.error("Failed to update payment config", error);
    throw new Error("Failed to update configuration on server");
  }

  // Revalidate cache
  revalidatePath("/admin/payment/config");

  return { success: true };
}
