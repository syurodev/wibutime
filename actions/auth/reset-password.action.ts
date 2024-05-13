"use server";

import * as z from "zod";
import nextBase64 from "next-base64";

import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { resetPasswordSchema } from "@/schemas/zod/auth/reset-password.schema";
import { FETCH_POST } from "@/common/fetch/post";
import { AUTH_API_ENDPOINT } from "@/common/enum/endpoint/auth";

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>
): Promise<ServerActionResponse<any>> => {
  try {
    const validateFields = resetPasswordSchema.safeParse(values);

    if (!validateFields.success)
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.EMAIL_INCORRECT,
      });

    const { email, password } = validateFields.data;

    const res = await FETCH_POST(
      AUTH_API_ENDPOINT.SEND_RESET_PASSWORD_VERIFICATION_CODE_V1,
      {
        email,
        password: nextBase64.encode(password),
      },
      false,
      "no-cache"
    );

    return serverActionResponse(res);
  } catch (error) {
    console.error(error);
    return serverActionResponse({
      status: 500,
      message: ResponseMessage.ERROR500,
    });
  }
};
