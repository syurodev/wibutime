import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
    const t = await getTranslations("Common");

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center text-center">
                <h1 className="text-6xl font-bold text-foreground">404</h1>
                <h2 className="text-2xl font-semibold text-muted-foreground">
                    {t("notFound.title")}
                </h2>
                <p className="text-muted-foreground max-w-md">
                    {t("notFound.description")}
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {t("notFound.ctaHome")}
                </Link>
            </main>
        </div>
    );
}
