"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
      className="flex items-center justify-start gap-2 p-0 cursor-pointer select-none"
    >
      {theme === "dark" ? (
        <LuMoon className="text-base rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 right-0" />
      ) : (
        <LuSun className="text-base rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      )}

      <p className="text-sm">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
    </div>
  );
};

export default React.memo(ThemeToggle);
