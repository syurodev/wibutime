import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "en" as Locale,

  // Optionally, you can configure path names for each locale
  // pathnames: {
  //   '/': '/',
  //   '/about': {
  //     en: '/about',
  //     vi: '/gioi-thieu'
  //   }
  // }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
