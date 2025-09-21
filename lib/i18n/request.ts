import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    // Import and merge all message files from subdirectories
    const [common] = await Promise.all([
        import(`../../resource/lang/common/${locale}.json`),
    ]);

    return {
        locale,
        messages: {
            Common: common.default,
        },
    };
});
