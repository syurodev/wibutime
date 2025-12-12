"use server";

import { serverApi } from "@/lib/api/server";
import { endpoints } from "@/lib/api/utils/endpoint";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  CreateOrganizationInput,
  CreateOrganizationSchema,
  Organization,
} from "./types";

interface CreateOrganizationState {
  success?: boolean;
  errors?: {
    [K in keyof CreateOrganizationInput]?: string[];
  };
  message?: string;
  data?: Organization; // Optional: return created org
}

// Helper to generate slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, "")
    .replaceAll(/[\s_-]+/g, "-")
    .replaceAll(/(^-+)|(-+$)/g, "");
}

export async function createOrganizationAction(
  prevState: CreateOrganizationState,
  formData: FormData
): Promise<CreateOrganizationState> {
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;
  const descriptionStr = formData.get("description") as string;

  if (!slug || slug.trim() === "") {
    slug = generateSlug(name);
  }

  const rawData: CreateOrganizationInput = {
    name,
    slug,
    description: descriptionStr ? JSON.parse(descriptionStr) : undefined,
  };

  // Validate fields
  const validated = CreateOrganizationSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please check your input.",
    };
  }

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const locale = await getLocale();

    const newOrg = await serverApi.post<Organization>(
      endpoints.organizations(),
      validated.data,
      {
        headers: {
          Cookie: cookieHeader,
          "x-locale-key": locale,
          "Accept-Language": locale,
        },
      }
    );

    revalidatePath("/organizations"); // Revalidate the workspace list page

    return {
      success: true,
      message: "Organization created successfully!",
      data: newOrg,
    };
  } catch (error: any) {
    // Return the error message directly, assuming backend returns translated/readable message
    return {
      message:
        error.message || "Failed to create organization. Please try again.",
      success: false,
    };
  }
}
