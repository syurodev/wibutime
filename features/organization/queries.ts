import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoints } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";
import { MyOrganizationsResponse, MyOrganizationsSchema } from "./types";

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
