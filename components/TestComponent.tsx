"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

import { useClientSession } from "@/hooks/client/useClientSession";

const TestComponent = () => {
  const session = useClientSession();
  console.log(session);
  return (
    <div>
      {session ? (
        <Button onClick={() => signOut()}>Đăng xuất</Button>
      ) : (
        <Link
          href={"/auth?page=login"}
          className={buttonVariants({ variant: "outline" })}
        >
          Đăng nhập
        </Link>
      )}
    </div>
  );
};

export default TestComponent;
