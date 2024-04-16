"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

import { Button } from "@/components/ui/button";

type IProps = {
  size?: "icon" | "default" | "sm" | "lg" | "xl";
  blur?: boolean;
};

const ThemeToggle: React.FC<IProps> = ({ size = "default", blur = false }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={"outline"}
      rounded={"full"}
      size={size}
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
      className={blur ? "bg-background/30" : "bg-background"}
    >
      {theme === "dark" ? (
        <LuMoon
          className={`text-base rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 right-0 ${
            size !== "icon" ? "mr-2" : ""
          }`}
        />
      ) : (
        <LuSun
          className={`text-base rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 ${
            size !== "icon" ? "mr-2" : ""
          }`}
        />
      )}

      {size !== "icon" && (
        <p className="text-sm">
          {theme === "dark" ? "Dark mode" : "Light mode"}
        </p>
      )}
    </Button>
  );
};

export default React.memo(ThemeToggle);
