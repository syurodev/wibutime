"use client";
import React from "react";

import FormWrapper from "@/components/page/Auth/wrapper/FormWrapper";

const AuthPageWrapper = () => {
  return (
    <div className="relative w-screen h-dvh overflow-hidden">
      <FormWrapper />
      <div className="w-full h-dvh hidden md:block bg-slate-500 -z-10"></div>
    </div>
  );
};

export default AuthPageWrapper;
