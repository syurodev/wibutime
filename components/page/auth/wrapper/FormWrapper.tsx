"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import LoginForm from "@/components/page/Auth/login/form/LoginForm";
import RegisterForm from "@/components/page/Auth/register/form/RegisterForm";
import VerificationForm from "@/components/page/Auth/verification/form/VerificationForm";
import ForgotPasswordForm from "@/components/page/Auth/forgot-password/form/ForgotPasswordForm";

type IProps = {
  className?: string;
};

export type PageContent =
  | "login"
  | "register"
  | "verification"
  | "change-password"
  | "forgot-password"
  | "error";

const FormWrapper: React.FC<IProps> = ({ className }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const getParams = (): PageContent => {
    if (
      ![
        "login",
        "register",
        "verification",
        "change-password",
        "forgot-password",
        "error",
      ].includes(searchParams.get("page") ?? "")
    ) {
      return "login";
    } else {
      return searchParams.get("page") as PageContent;
    }
  };

  const [email, setEmail] = useState<string | null>(null);

  const pageContent: PageContent = getParams();

  return (
    <motion.div
      layout
      className={cn(
        `p-3 flex flex-col items-center justify-between z-20 bg-background absolute top-0 md:w-1/2 min-w-[450px] overflow-y-auto showScroll h-full overflow-x-hidden shadow-sm ease-in-out ${
          pageContent === "verification" ||
          pageContent === "forgot-password" ||
          pageContent === "change-password"
            ? "md:right-0"
            : "md:left-0"
        }`,
        className
      )}
    >
      <Link href={"/"} className="font-semibold text-sm">
        WIBUTIME
      </Link>

      <div>
        {(() => {
          switch (pageContent) {
            case "login":
              return <LoginForm key={"LoginForm"} />;

            case "register":
              return <RegisterForm key={"RegisterForm"} setEmail={setEmail} />;

            case "verification":
              return (
                <VerificationForm key={"VerificationForm"} email={email} />
              );

            case "forgot-password":
              return <ForgotPasswordForm key={"ForgotPasswordForm"} />;

            case "error":
              return <div>error</div>;

            default:
              return <LoginForm key={"LoginFormDefault"} />;
          }
        })()}

        <motion.div className="mx-auto w-fit mt-3" layout>
          <span className="text-xs">
            {pageContent === "register"
              ? "Đã có tài khoản?"
              : "Chưa có tài khoản?"}
          </span>
          <Button
            variant={"link"}
            size={"sm"}
            onClick={() =>
              router.push(
                pageContent === "login" ? "?page=register" : "?page=login"
              )
            }
            className="-ml-1"
          >
            {pageContent === "login" ? "Đăng ký" : "Đăng nhập"}
          </Button>
        </motion.div>
      </div>

      <h6 className="text-xs text-center text-pretty">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
        sequi? Illum, quidem corporis nisi odio magni suscipit ex laboriosam ut
        vel natus reprehenderit, sunt, hic unde libero iste nemo vitae?
      </h6>
    </motion.div>
  );
};

export default FormWrapper;
