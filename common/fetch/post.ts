"use server";

import { useServerSession } from "@/hooks/server/useServerSession";
import { ResponseMessage } from "../response/message.response";

export async function FETCH_POST<T>(
  endpoint: string,
  body: any,
  withToken?: boolean,
  cache?: RequestCache
): Promise<ApiResponse<T | null>> {
  let headers: any = {
    "Content-Type": "application/json",
  };

  if (withToken) {
    const session = await useServerSession();
    headers.Authorization = `Bearer ${session?.backend_token.access_token}`;
  }

  const res = await fetch(process.env.CONFIG_GATEWAY_URL + endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: cache ?? "default",
  });

  if (!res.ok) {
    return {
      status: 400,
      message: ResponseMessage.ERROR500,
      data: null,
    };
  }

  return await res.json();
}
