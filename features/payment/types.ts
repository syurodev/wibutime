export interface PaymentConfigItem {
  key: string;
  value: string;
  value_type: string;
  description?: string;
  is_sensitive: boolean;
  updated_at: string;
}

export interface ConfigListResponse {
  configs: PaymentConfigItem[];
}

export interface SePayConfig {
  apiToken: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export interface UpdateSePayConfigParams extends SePayConfig {
  token?: string;
}
