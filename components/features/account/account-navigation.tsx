"use client";

import { useNav } from "@/components/layout/nav/useNav";
import { Shield, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export function AccountNavigation() {
  const { setNavItems } = useNav();
  const t = useTranslations("account.tabs");

  useEffect(() => {
    setNavItems([
      {
        id: "general",
        type: "link",
        href: "/account",
        icon: <User className="w-5 h-5" />,
        label: t("general"),
      },
      {
        id: "security",
        type: "link",
        href: "/account/security",
        icon: <Shield className="w-5 h-5" />,
        label: t("security"),
      },
    ]);
  }, [setNavItems, t]);

  return null;
}
