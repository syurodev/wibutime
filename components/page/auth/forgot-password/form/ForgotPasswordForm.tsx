"use client";

import React from "react";

import VerificationForgotPassword from "@/components/page/Auth/forgot-password/form/VerificationForgotPassword";
import ResetPasswordForm from "@/components/page/Auth/forgot-password/form/ResetPasswordForm";
import SendForgotPasswordVerficationCode from "@/components/page/Auth/forgot-password/form/SendForgotPasswordVerficationCode";

const ForgotPasswordForm = () => {
  const [verification, setVerification] = React.useState<0 | 1 | 2>(0);
  const [email, setEmail] = React.useState<string | null>(null);

  return (
    // <AnimatePresence mode="wait">
    // {
    verification === 1 ? (
      <VerificationForgotPassword
        email={email}
        setVerification={setVerification}
      />
    ) : verification === 2 ? (
      <ResetPasswordForm email={email} setVerification={setVerification} />
    ) : (
      <SendForgotPasswordVerficationCode
        setEmail={setEmail}
        setVerification={setVerification}
      />
    )
    // }
    // </AnimatePresence>
  );
};

export default ForgotPasswordForm;
