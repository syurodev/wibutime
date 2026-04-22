import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: {
      common: (await import(`../messages/common/${locale}.json`)).default,
      auth: (await import(`../messages/auth/${locale}.json`)).default,
      nav: (await import(`../messages/nav/${locale}.json`)).default,
    },
  }
})