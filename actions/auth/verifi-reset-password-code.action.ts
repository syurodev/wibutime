"use server";

import * as z from "zod";

import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { verifiForgotPasswordCodeSchema } from "@/schemas/zod/auth/verifi-forgot-password-code.schema";
import { FETCH_POST } from "@/common/fetch/post";
import { AUTH_API_ENDPOINT } from "@/common/enum/endpoint/auth";

export const verifiResetPasswordCode = async (
  values: z.infer<typeof verifiForgotPasswordCodeSchema>
): Promise<ServerActionResponse<any>> => {
  try {
    const validateFields = verifiForgotPasswordCodeSchema.safeParse(values);

    if (!validateFields.success)
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.DATA_INPUT_ERROR,
      });

    const { email, code } = validateFields.data;
    const res = await FETCH_POST(
      AUTH_API_ENDPOINT.RESET_PASSWORD_VERIFICATION_CODE_V1,
      {
        email,
        code,
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
