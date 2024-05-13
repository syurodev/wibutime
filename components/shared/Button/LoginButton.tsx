"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useClientSession } from "@/hooks/client/useClientSession";
import { cn } from "@/lib/utils";
import DivSlide from "../Animation/DivSlide";

type IProps = {
  size: "icon" | "default" | "sm" | "lg" | "xl";
  blur?: boolean;
  delay?: number;
  className?: string;
};

const LoginButton: React.FC<IProps> = ({
  size = "default",
  blur = false,
  delay,
  className,
}) => {
  const session = useClientSession();
  console.log(session);
  return (
    <DivSlide delay={delay ?? 0} className="w-fit h-fit">
      {session ? (
        <Button
          size={size}
          rounded={"full"}
          variant={"outline"}
          className={cn(`group ${blur ? "bg-background/30" : ""}`, className)}
          onClick={() => signOut()}
          type="button"
        >
          <LogOut
            className={`${
              size !== "icon" ? "mr-2" : ""
            } group-hover:text-destructive transition-colors duration-150 size-4`}
          />
          <span className="font-semibold group-hover:text-destructive transition-colors duration-150">
            {size !== "icon" && "Đăng xuất"}
          </span>
        </Button>
      ) : (
        <Link
          href={"/auth?page=login"}
          className={cn(
            `${buttonVariants({
              variant: "outline",
              size: size,
              rounded: "full",
            })} ${blur ? "bg-background/30" : ""}`,
            className
          )}
        >
          <LogIn className={`${size !== "icon" ? "mr-2" : ""} size-4`} />
          <span className="font-semibold">
            {size !== "icon" && "Đăng nhập"}
          </span>
        </Link>
      )}
    </DivSlide>
  );
};

export default LoginButton;
