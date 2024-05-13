"use server";

import * as z from "zod";

import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { forgotPasswordSchema } from "@/schemas/zod/auth/forgot-password.schema";
import { FETCH_POST } from "@/common/fetch/post";
import { AUTH_API_ENDPOINT } from "@/common/enum/endpoint/auth";

export const sendResetPasswordRequest = async (
  values: z.infer<typeof forgotPasswordSchema>
): Promise<ServerActionResponse<any>> => {
  try {
    const validateFields = forgotPasswordSchema.safeParse(values);

    if (!validateFields.success)
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.EMAIL_INCORRECT,
      });

    const { email } = validateFields.data;

    const res = await FETCH_POST(
      AUTH_API_ENDPOINT.SEND_RESET_PASSWORD_VERIFICATION_CODE_V1,
      {
        email,
      },
      false,
      "no-cache"
    );

    return serverActionResponse({
      apiResponse: res,
    });
  } catch (error) {
    console.error(error);
    return serverActionResponse({
      status: 500,
      message: ResponseMessage.ERROR500,
    });
  }
};
