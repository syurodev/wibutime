/**
 * Language Toggle Compact - For account menu
 * Horizontal layout with language selection buttons
 */

"use client";

import { useLanguage } from "@/lib/hooks/use-user-settings";
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageToggleCompact() {
  const { setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const languages = [
    {
      value: "en" as const,
      label: "English",
      flag: "🇺🇸",
    },
    {
      value: "vi" as const,
      label: "Tiếng Việt",
      flag: "🇻🇳",
    },
  ];

  const handleLanguageChange = (locale: "en" | "vi") => {
    // Update user settings
    setLanguage(locale);

    // Navigate to the same path with new locale
    router.replace(pathname, { locale });
  };

  return (
    <div className="px-3 py-2 space-y-2">
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        <Languages className="h-3.5 w-3.5" />
        Language
      </label>
      <div className="flex gap-1">
        {languages.map(({ value, label, flag }) => (
          <button
            key={value}
            onClick={() => handleLanguageChange(value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              currentLocale === value
                ? "bg-primary text-primary-foreground"
                : "bg-accent hover:bg-accent/80 text-accent-foreground"
            )}
            aria-label={`Set language to ${label}`}
          >
            <span className="text-sm">{flag}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
