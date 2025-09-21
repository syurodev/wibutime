import { auth } from "@/lib/auth/auth";
import { routing } from "@/lib/i18n/routing";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export default auth((request) => {
    return intlMiddleware(request);
});

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
