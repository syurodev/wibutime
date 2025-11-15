/**
 * Editor Demo Page Navigation
 */

"use client";

import { useNav } from "@/components/layout/nav/useNav";
import { FileEdit, Home } from "lucide-react";
import { useEffect } from "react";

export function EditorDemoNavigation() {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems([
      {
        id: "home",
        type: "link",
        href: "/",
        icon: <Home className="h-5 w-5" />,
        label: "Home",
      },
      {
        id: "edit",
        type: "link",
        href: "/editor-demo",
        icon: <FileEdit className="h-5 w-5" />,
        label: "Editor",
      },
    ]);
  }, [setNavItems]);

  return null;
}
