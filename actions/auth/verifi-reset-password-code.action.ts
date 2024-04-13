"use server";

import * as z from "zod";

import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { verifiForgotPasswordCodeSchema } from "@/schemas/zod/auth/verifi-forgot-password-code.schema";

export const verifiResetPasswordCode = async (
  values: z.infer<typeof verifiForgotPasswordCodeSchema>
): Promise<ServerActionResponse<ApiNoDataResponse>> => {
  try {
    const validateFields = verifiForgotPasswordCodeSchema.safeParse(values);

    if (!validateFields.success)
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.DATA_INPUT_ERROR,
      });

    const { email, code } = validateFields.data;

    const res = await fetch(
      `${process.env.CONFIG_GATEWAY_URL}/auth/verification-forgot-password`,
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
