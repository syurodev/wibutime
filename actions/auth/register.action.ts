"use server";

import * as z from "zod";
import nextBase64 from "next-base64";

import { registerSchema } from "@/schemas/zod/auth/register.schema";
import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { AUTH_API_ENDPOINT } from "@/common/enum/endpoint/auth";
import { FETCH_POST } from "@/common/fetch/post";

export async function register(
  values: z.infer<typeof registerSchema>
): Promise<ServerActionResponse<UserResponse | null>> {
  try {
    const validateFields = registerSchema.safeParse(values);

    if (!validateFields.success) {
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.DATA_INPUT_ERROR,
      });
    }

    const { username, name, password, email, confirmPassword } =
      validateFields.data;

    if (
      password.toLocaleLowerCase().trim() !==
      confirmPassword.toLocaleLowerCase().trim()
    ) {
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.REPASSWORD_INCORRECT,
      });
    }

    const res = await FETCH_POST<UserResponse>(
      AUTH_API_ENDPOINT.REGISTER_V1,
      {
        username,
        password: nextBase64.encode(password),
        name,
        email,
        provider: "credentials",
      },
      false,
      "no-cache"
    );

    return res;
  } catch (error) {
    console.log(error);
    return serverActionResponse({
      status: 500,
      message: ResponseMessage.ERROR500,
    });
  }
}
