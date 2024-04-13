"use server";

import * as z from "zod";
import nextBase64 from "next-base64";

import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { resetPasswordSchema } from "@/schemas/zod/auth/reset-password.schema";

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>
): Promise<ServerActionResponse<ApiNoDataResponse>> => {
  try {
    const validateFields = resetPasswordSchema.safeParse(values);

    if (!validateFields.success)
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.EMAIL_INCORRECT,
      });

    const { email, password } = validateFields.data;

    const res = await fetch(
      `${process.env.CONFIG_GATEWAY_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: nextBase64.encode(password),
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
