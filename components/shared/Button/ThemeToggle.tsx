"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunMedium, MoonStar, SunMoon } from "lucide-react";

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
      onClick={() =>
        theme === "dark"
          ? setTheme("system")
          : theme === "system"
          ? setTheme("light")
          : setTheme("dark")
      }
      className={blur ? "bg-background/30" : "bg-background"}
    >
      {theme === "dark" ? (
        <MoonStar
          className={`text-base rotate-90 scale-0 transition-all dark:rotate-0 transition-none duration-150 dark:scale-100 right-0 size-4 ${
            size !== "icon" ? "mr-2" : ""
          }`}
        />
      ) : theme === "light" ? (
        <SunMedium
          className={`text-base rotate-0 scale-100 transition-all dark:-rotate-90 transition-none duration-150 dark:scale-0 size-4 ${
            size !== "icon" ? "mr-2" : ""
          }`}
        />
      ) : (
        <SunMoon
          className={`text-base rotate-0 transition-all size-4 ${
            size !== "icon" ? "mr-2" : ""
          } ${theme === "system" ? "scale-100" : "scale-0"}`}
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

export default ThemeToggle;
