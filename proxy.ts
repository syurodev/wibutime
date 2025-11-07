import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export function proxy(request: Request) {
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*']
};
