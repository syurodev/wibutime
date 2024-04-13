"use server";

import * as z from "zod";

import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { forgotPasswordSchema } from "@/schemas/zod/auth/forgot-password.schema";

export const sendResetPasswordRequest = async (
  values: z.infer<typeof forgotPasswordSchema>
): Promise<ServerActionResponse<ApiNoDataResponse>> => {
  try {
    const validateFields = forgotPasswordSchema.safeParse(values);

    if (!validateFields.success)
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.EMAIL_INCORRECT,
      });

    const { email } = validateFields.data;

    const res = await fetch(
      `${process.env.CONFIG_GATEWAY_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
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
