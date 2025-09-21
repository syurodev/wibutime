import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["vi", "en"],

    // Used when no locale matches
    defaultLocale: "vi",

    // Always include the locale in the pathname to match the app directory structure
    localePrefix: "always",
});
