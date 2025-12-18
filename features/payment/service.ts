import { StandardResponse } from "@/lib/api/types";
import { api } from "@/lib/api/utils/fetch";
import {
  ConfigListResponse,
  SePayConfig,
  UpdateSePayConfigParams,
} from "./types";

export const PaymentService = {
  /**
   * Get SePay configuration
   */
  async getSePayConfig(token?: string): Promise<SePayConfig> {
    const res = await api.get<StandardResponse<ConfigListResponse>>(
      "/admin/payment/config",
      {
        token,
        // Ensure we don't cache this too aggressively as admin might update it
        next: { tags: ["payment-config"], revalidate: 0 },
      }
    );

    if (!res.success || !res.data) {
      throw new Error(res.message || "Failed to fetch payment configuration");
    }

    const items = res.data.configs;
    const find = (key: string) => items.find((i) => i.key === key)?.value || "";

    return {
      apiToken: find("sepay.api_token"),
      accountNumber: find("sepay.account_number"),
      bankName: find("sepay.bank_name"),
      accountName: find("sepay.account_name"),
    };
  },

  /**
   * Update SePay configuration
   */
  async updateSePayConfig(params: UpdateSePayConfigParams): Promise<void> {
    const { token, ...config } = params;
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

    // Call Bulk Update API
    const res = await api.put<StandardResponse<any>>(
      "/admin/payment/config",
      { configs: updates },
      { token }
    );

    if (!res.success) {
      throw new Error(res.message || "Failed to update payment configuration");
    }
  },
};
