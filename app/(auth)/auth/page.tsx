import React from "react";
import { redirect } from "next/navigation";

import AuthPageWrapper from "@/components/page/Auth/AuthPageWrapper";
import { useServerSession } from "@/hooks/server/useServerSession";

const Auth = async () => {
  const session = await useServerSession();

  if (session) {
    redirect("/");
  }

  return <AuthPageWrapper />;
};

export default Auth;
