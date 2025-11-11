import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Suspense } from "react";
import { type Locale, locales } from "@/i18n/routing";
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
async function I18nProvider({ children }: { children: React.ReactNode }) {
	const messages = await getMessages();
	return (
		<NextIntlClientProvider messages={messages}>
			{children}
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

	return (
		<html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
			>
				<Suspense fallback={null}>
					<I18nProvider>{children}</I18nProvider>
				</Suspense>
			</body>
		</html>
	);
}
