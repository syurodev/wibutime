"use server";

import * as z from "zod";
import nextBase64 from "next-base64";

import { registerSchema } from "@/schemas/zod/auth/register.schema";
import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";

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

    const res = await fetch(`${process.env.CONFIG_GATEWAY_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password: nextBase64.encode(password),
        name,
        email,
        provider: "credentials",
      }),
    });

    if (!res.ok) {
      return serverActionResponse({
        status: 400,
        message: ResponseMessage.LOGIN_ERROR,
      });
    }

    return serverActionResponse<UserResponse | null>({
      apiResponse: await res.json(),
    });
  } catch (error) {
    console.log(error);
    return serverActionResponse({
      status: 500,
      message: ResponseMessage.ERROR500,
    });
  }
}
