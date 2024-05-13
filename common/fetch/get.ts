"use server";

import { useServerSession } from "@/hooks/server/useServerSession";
import { ResponseMessage } from "../response/message.response";

export async function FETCH_GET<T>(
  endpoint: string,
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
  console.log(process.env.CONFIG_GATEWAY_URL + endpoint);
  const res = await fetch(process.env.CONFIG_GATEWAY_URL + endpoint, {
    method: "GET",
    headers,
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
