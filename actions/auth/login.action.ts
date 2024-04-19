"use server";

import * as z from "zod";
import nextBase64 from "next-base64";

import { loginSchema } from "@/schemas/zod/auth/auth.schema";
import { serverActionResponse } from "@/common/response/action.response";
import { ResponseMessage } from "@/common/response/message.response";
import { signIn } from "@/auth";

export const login = async (
  values: z.infer<typeof loginSchema>
): Promise<ServerActionResponse<UserResponse | null>> => {
  try {
    const validateFields = loginSchema.safeParse(values);

    if (!validateFields.success) {
      return serverActionResponse({
        message: ResponseMessage.DATA_INPUT_ERROR,
      });
    }

    const { username, password } = validateFields.data;

    try {
      await signIn("credentials", {
        username,
        password: nextBase64.encode(password),
        redirect: false,
      });

      return serverActionResponse({
        status: 200,
        message: "Đăng nhập thành công!",
      });
    } catch (error) {
      return serverActionResponse({
        status: 400,
        message: "Đăng nhập không thành công!",
      });
    }
  } catch (error) {
    console.log(error);
    return serverActionResponse({
      status: 500,
      message: ResponseMessage.ERROR500,
    });
  }
};
