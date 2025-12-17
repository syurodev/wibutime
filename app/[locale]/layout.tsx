import { type Locale, locales } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Type guard to check if a string is a valid locale
function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * I18n Provider Component - Wrapped in Suspense boundary
 * Handles async data access (getMessages) within Suspense for Cache Components compatibility
 */
import { GlassEffectApplier } from "@/components/effects/glass-effect-applier";
import { LiquidGlassFilter } from "@/components/effects/liquid-glass-filter";
import { ClientProviders } from "@/components/providers/client-providers";
import { SessionHydrator } from "@/components/providers/session-hydrator";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { loadMessages } from "@/i18n/request";
import { cacheLife, cacheTag } from "next/cache";

async function getCachedMessages(locale: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`messages-${locale}`);
  return loadMessages(locale as any);
}

/**
 * I18n Provider Wrapper
 * Handles loading messages and configuring next-intl
 */
async function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const messages = await getCachedMessages(locale);
  return (
    <NextIntlClientProvider messages={messages}>
      <ClientProviders>{children}</ClientProviders>
    </NextIntlClientProvider>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider>
          <LiquidGlassFilter />
          <GlassEffectApplier />
          <Suspense fallback={null}>
            <SessionHydrator />
          </Suspense>
          <Suspense fallback={null}>
            <I18nProvider locale={locale}>{children}</I18nProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
