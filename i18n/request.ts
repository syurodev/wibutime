import { LANG } from "@/lib/constants/i18n";
import { getRequestConfig } from "next-intl/server";
import { locales, type Locale } from "./routing";

// Type guard to check if a string is a valid locale
function isValidLocale(locale: string | undefined): locale is Locale {
  return locale !== undefined && locales.includes(locale as Locale);
}

// Load all domain translation files
export async function loadMessages(locale: Locale) {
  const common = (await import(`./lang/common/${locale}.json`)).default;
  const navigation = (await import(`./lang/navigation/${locale}.json`)).default;
  const buttons = (await import(`./lang/buttons/${locale}.json`)).default;
  const auth = (await import(`./lang/auth/${locale}.json`)).default;
  const home = (await import(`./lang/home/${locale}.json`)).default;
  const novel = (await import(`./lang/novel/${locale}.json`)).default;
  const library = (await import(`./lang/library/${locale}.json`)).default;
  const history = (await import(`./lang/history/${locale}.json`)).default;
  const dashboard = (await import(`./lang/dashboard/${locale}.json`)).default;
  const workspace = (await import(`./lang/workspace/${locale}.json`)).default;

  return {
    common,
    navigation,
    buttons,
    auth,
    home,
    novel,
    library,
    history,
    dashboard,
    workspace,
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale: LANG | undefined = (await requestLocale) as LANG | undefined;

  // Ensure that the incoming locale is valid
  if (!isValidLocale(locale)) {
    locale = "en";
  }

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
