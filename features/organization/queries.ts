import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoints } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";
import {
  MyOrganizationsResponse,
  MyOrganizationsSchema,
  Organization,
  OrganizationSchema,
} from "./types";

/**
 * Get user's organizations (owned and member)
 */
export const getMyOrganizations = cache(
  async (): Promise<MyOrganizationsResponse> => {
    const url = endpoints.myOrganizations();

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        tags: ["organizations", "my-organizations"],
        revalidate: 0, // Always fetch fresh data for personal workspaces
      },
      cache: "no-store",
    });

    if (!isSuccessResponse(response)) {
      // If 401, return empty structure or throw
      // Should throw to let error boundary handle or middleware redirect
      throw new Error(response.message || "Failed to fetch organizations");
    }

    // Parse using Zod schema
    return ApiParser.parse(MyOrganizationsSchema, response);
  }
);

/**
 * Get top organizations by views with optional rank comparison
 */
export const getTopOrganizations = cache(
  async (params?: {
    limit?: number;
    period?: string;
    include_rank_change?: boolean;
  }): Promise<Organization[]> => {
    // Manually construct URL since endpoints helper might not support this specific path yet
    // Or extend endpoints helper. Providing raw path for now.
    const baseUrl = "/organizations/top";
    const queryParams = new URLSearchParams({
      limit: (params?.limit || 10).toString(),
      period: params?.period || "week",
    });

    if (params?.include_rank_change) {
      queryParams.append("include_rank_change", "true");
    }

    const url = `${baseUrl}?${queryParams.toString()}`;

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: [
          "organizations",
          "top-organizations",
          `top-orgs-${params?.period}-${params?.limit}-${params?.include_rank_change}`,
        ],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch top organizations");
    }

    return ApiParser.parseResponseArray(OrganizationSchema, response);
  }
);
