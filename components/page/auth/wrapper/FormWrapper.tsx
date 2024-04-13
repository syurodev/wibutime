"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import AnimationLogo from "@/components/shared/Animation/Logo/AnimationLogo";

const RegisterForm = dynamic(() => import("../register/form/RegisterForm"), {
  ssr: false,
});
const VerificationForm = dynamic(
  () => import("../verification/form/VerificationForm"),
  {
    ssr: false,
  }
);
const LoginForm = dynamic(() => import("../login/form/LoginForm"), {
  ssr: false,
});
const ForgotPasswordForm = dynamic(
  () => import("../forgot-password/form/ForgotPasswordForm"),
  {
    ssr: false,
  }
);

type IProps = {
  className?: string;
};

export type PageContent =
  | "login"
  | "register"
  | "verification"
  | "change-password"
  | "forgot-password";

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
      ].includes(searchParams.get("page") ?? "")
    ) {
      return "login";
    } else {
      return searchParams.get("page") as PageContent;
    }
  };

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
      <AnimationLogo />

      <AnimatePresence mode="wait">
        <div>
          {(() => {
            switch (pageContent) {
              case "login":
                return <LoginForm />;

              case "register":
                return <RegisterForm />;

              case "verification":
                return <VerificationForm />;

              case "forgot-password":
                return <ForgotPasswordForm />;

              default:
                return <LoginForm />;
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
      </AnimatePresence>

      <h6 className="text-xs text-center text-pretty">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
        sequi? Illum, quidem corporis nisi odio magni suscipit ex laboriosam ut
        vel natus reprehenderit, sunt, hic unde libero iste nemo vitae?
      </h6>
    </motion.div>
  );
};

export default FormWrapper;
