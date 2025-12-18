import { SePayConfigForm } from "@/features/payment/components/sepay-config-form";
import { ConfigListResponse, SePayConfig } from "@/features/payment/types";
import { serverApi } from "@/lib/api/server";
import { StandardResponse } from "@/lib/api/types";
import { cookies } from "next/headers";

export const metadata = {
  title: "Payment Configuration",
};

async function getSePayConfig(): Promise<SePayConfig> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const res = await serverApi.get<StandardResponse<ConfigListResponse>>(
      "/admin/payment/config",
      {
        headers: { Cookie: cookieHeader },
        next: { tags: ["payment-config"] },
      }
    );

    if (!res || !res.success || !res.data) {
      // If error is 401/403, might need redirect
      // For now return empty config
      return {
        apiToken: "",
        accountNumber: "",
        bankName: "",
        accountName: "",
      };
    }

    const items = res.data.configs;
    const find = (key: string) => items.find((i) => i.key === key)?.value || "";

    return {
      apiToken: find("sepay.api_token"),
      accountNumber: find("sepay.account_number"),
      bankName: find("sepay.bank_name"),
      accountName: find("sepay.account_name"),
    };
  } catch (error) {
    console.error("Error fetching payment config:", error);
    // Return empty if API fails (e.g. backend down or 404)
    return {
      apiToken: "",
      accountNumber: "",
      bankName: "",
      accountName: "",
    };
  }
}

export default async function PaymentConfigPage() {
  const config = await getSePayConfig();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">SePay Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Configure SePay payment gateway integration details.
        </p>
      </div>
      <div className="p-6 bg-card rounded-lg border">
        <SePayConfigForm initialData={config} />
      </div>
    </div>
  );
}
