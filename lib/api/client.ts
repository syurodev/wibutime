import { PaginatedResponse, StandardResponse } from "@/lib/types/api";

export interface ApiClientConfig {
    baseUrl?: string;
    timeout?: number;
    defaultHeaders?: Record<string, string>;
    onRequest?: (config: RequestConfig) => void | Promise<void>;
    onResponse?: (response: Response) => void | Promise<void>;
    onError?: (error: ApiError) => void | Promise<void>;
}

export interface RequestConfig extends RequestInit {
    url: string;
    timeout?: number;
    skipAuth?: boolean;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string,
        public response?: Response,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export class ApiClient {
    private config: Required<ApiClientConfig>;

    constructor(config: ApiClientConfig = {}) {
        this.config = {
            baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
            timeout: 30000,
            defaultHeaders: {
                "Content-Type": "application/json",
            },
            onRequest: async () => {},
            onResponse: async () => {},
            onError: async () => {},
            ...config,
        };
    }

    private async getAuthHeaders(): Promise<Record<string, string>> {
        // TODO: Implement token retrieval from auth context/localStorage
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("access_token")
                : null;

        if (token) {
            return { Authorization: `Bearer ${token}` };
        }

        return {};
    }

    private createAbortController(timeout: number): AbortController {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeout);
        return controller;
    }

    private async handleResponse<T>(
        response: Response,
    ): Promise<StandardResponse<T>> {
        await this.config.onResponse(response);

        let data: StandardResponse<T>;

        try {
            data = await response.json();
        } catch (error) {
            throw new ApiError(
                "Invalid JSON response",
                response.status,
                "INVALID_JSON",
                response,
            );
        }

        if (!response.ok) {
            const errorMessage =
                data.error?.description ||
                data.message ||
                `HTTP ${response.status}`;
            const errorCode = data.error?.code || "HTTP_ERROR";

            const apiError = new ApiError(
                errorMessage,
                response.status,
                errorCode,
                response,
            );
            await this.config.onError(apiError);
            throw apiError;
        }

        return data;
    }

    private async request<T>(
        config: RequestConfig,
    ): Promise<StandardResponse<T>> {
        const {
            url,
            timeout = this.config.timeout,
            skipAuth = false,
            headers = {},
            ...fetchOptions
        } = config;

        const fullUrl = url.startsWith("http")
            ? url
            : `${this.config.baseUrl}${url}`;

        const controller = this.createAbortController(timeout);

        const authHeaders = skipAuth ? {} : await this.getAuthHeaders();

        const requestConfig: RequestInit = {
            ...fetchOptions,
            headers: {
                ...this.config.defaultHeaders,
                ...authHeaders,
                ...headers,
            },
            signal: controller.signal,
        };

        await this.config.onRequest({ ...config, url: fullUrl });

        try {
            const response = await fetch(fullUrl, requestConfig);
            return await this.handleResponse<T>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            if (error instanceof DOMException && error.name === "AbortError") {
                const timeoutError = new ApiError(
                    "Request timeout",
                    408,
                    "TIMEOUT",
                );
                await this.config.onError(timeoutError);
                throw timeoutError;
            }

            const networkError = new ApiError(
                error instanceof Error ? error.message : "Network error",
                0,
                "NETWORK_ERROR",
            );
            await this.config.onError(networkError);
            throw networkError;
        }
    }

    async get<T>(
        url: string,
        options: Omit<RequestConfig, "url" | "method"> = {},
    ): Promise<StandardResponse<T>> {
        return this.request<T>({ ...options, url, method: "GET" });
    }

    async post<T>(
        url: string,
        data?: any,
        options: Omit<RequestConfig, "url" | "method" | "body"> = {},
    ): Promise<StandardResponse<T>> {
        return this.request<T>({
            ...options,
            url,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(
        url: string,
        data?: any,
        options: Omit<RequestConfig, "url" | "method" | "body"> = {},
    ): Promise<StandardResponse<T>> {
        return this.request<T>({
            ...options,
            url,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(
        url: string,
        data?: any,
        options: Omit<RequestConfig, "url" | "method" | "body"> = {},
    ): Promise<StandardResponse<T>> {
        return this.request<T>({
            ...options,
            url,
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(
        url: string,
        options: Omit<RequestConfig, "url" | "method"> = {},
    ): Promise<StandardResponse<T>> {
        return this.request<T>({ ...options, url, method: "DELETE" });
    }

    // Helper method for paginated endpoints
    async getPaginated<T>(
        url: string,
        options: Omit<RequestConfig, "url" | "method"> = {},
    ): Promise<StandardResponse<PaginatedResponse<T>>> {
        return this.request<PaginatedResponse<T>>({
            ...options,
            url,
            method: "GET",
        });
    }
}

// Default client instance
export const apiClient = new ApiClient();

// Helper function to create configured client
export const createApiClient = (config: ApiClientConfig) =>
    new ApiClient(config);
