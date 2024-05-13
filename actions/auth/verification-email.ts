"use server";

import * as z from "zod";

import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { verificationEmailSchema } from "@/schemas/zod/auth/verification-email.schema";
import { AUTH_API_ENDPOINT } from "@/common/enum/endpoint/auth";
import { FETCH_POST } from "@/common/fetch/post";

export const verifiEmailCode = async (
  values: z.infer<typeof verificationEmailSchema>
): Promise<ServerActionResponse<any>> => {
  try {
    const validateFields = verificationEmailSchema.safeParse(values);

    if (!validateFields.success)
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.DATA_INPUT_ERROR,
      });

    const { email, code } = validateFields.data;

    const res = await FETCH_POST(
      AUTH_API_ENDPOINT.VERIFICATION_EMAIL_V1,
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
