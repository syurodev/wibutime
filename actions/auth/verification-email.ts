"use server";

import * as z from "zod";

import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { verificationEmailSchema } from "@/schemas/zod/auth/verification-email.schema";

export const verifiEmailCode = async (
  values: z.infer<typeof verificationEmailSchema>
): Promise<ServerActionResponse<ApiNoDataResponse>> => {
  try {
    const validateFields = verificationEmailSchema.safeParse(values);

    if (!validateFields.success)
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.DATA_INPUT_ERROR,
      });

    const { email, code } = validateFields.data;

    const res = await fetch(
      `${process.env.CONFIG_GATEWAY_URL}/auth/verification-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      }
    );

    if (!res.ok) {
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.ERROR500,
      });
    }

    return serverActionResponse<ApiNoDataResponse>({
      apiResponse: await res.json(),
    });
  } catch (error) {
    console.error(error);
    return serverActionResponse({
      status: 500,
      message: ResponseMessage.ERROR500,
    });
  }
};
