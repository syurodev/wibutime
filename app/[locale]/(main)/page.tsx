import { getNavConfig } from "@/components/layout/nav/nav-configs";
import NavigationSetter from "@/components/layout/nav/navigation-setter";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function MainPage() {
    const t = await getTranslations("Common");
    const navItems = getNavConfig("home");

    const featuredCollections = [
        {
            key: "anime",
            image: "/images/image2.jpg",
            title: t("home.featured.animeTitle"),
            description: t("home.featured.animeDescription"),
            gradient: "from-fuchsia-500/40 via-purple-500/30 to-transparent",
        },
        {
            key: "manga",
            image: "/images/image3.jpg",
            title: t("home.featured.mangaTitle"),
            description: t("home.featured.mangaDescription"),
            gradient: "from-blue-500/40 via-cyan-500/30 to-transparent",
        },
        {
            key: "novels",
            image: "/images/image4.png",
            title: t("home.featured.novelTitle"),
            description: t("home.featured.novelDescription"),
            gradient: "from-amber-500/40 via-rose-500/30 to-transparent",
        },
    ] as const;

    const spotlightCards = [
        {
            key: "anime",
            badge: t("home.categories.anime"),
            title: t("home.spotlight.animeTitle"),
            description: t("home.spotlight.animeDescription"),
            image: "/images/image1.jpg",
        },
        {
            key: "manga",
            badge: t("home.categories.manga"),
            title: t("home.spotlight.mangaTitle"),
            description: t("home.spotlight.mangaDescription"),
            image: "/images/image2.jpg",
        },
        {
            key: "novels",
            badge: t("home.categories.novels"),
            title: t("home.spotlight.novelTitle"),
            description: t("home.spotlight.novelDescription"),
            image: "/images/image3.jpg",
        },
    ] as const;

    return (
        <>
            <NavigationSetter items={navItems} />

            <main className="flex flex-col gap-12 pb-24">
                <section className="relative mx-4 mt-6 overflow-hidden rounded-3xl border bg-gradient-to-r from-purple-950/20 via-slate-950/10 to-slate-900/20">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/image1.jpg"
                            alt={t("home.hero.title")}
                            fill
                            priority
                            sizes="(min-width: 1024px) 60vw, 100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
                    </div>

                    <div className="relative z-10 grid gap-10 p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] md:p-12">
                        <div className="space-y-6">
                            <Badge className="bg-primary/10 text-primary-foreground/80 backdrop-blur-sm">
                                {t("home.hero.pill")}
                            </Badge>
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                                {t("home.hero.title")}
                            </h1>
                            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                                {t("home.hero.subtitle")}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild>
                                    <a href="#catalog">{t("home.hero.primaryCta")}</a>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="backdrop-blur-sm"
                                >
                                    <a href="#spotlight">{t("home.hero.secondaryCta")}</a>
                                </Button>
                            </div>
                        </div>

                        <div className="relative hidden overflow-hidden rounded-2xl border border-border/40 bg-background/70 shadow-xl backdrop-blur md:flex">
                            <Image
                                src="/images/image4.png"
                                alt={t("home.categories.anime")}
                                width={640}
                                height={480}
                                className="h-full w-full object-cover object-center"
                                sizes="(min-width: 768px) 35vw, 90vw"
                            />
                        </div>
                    </div>
                </section>

                <section id="catalog" className="px-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {t("home.featured.title")}
                            </h2>
                            <p className="text-muted-foreground">
                                {t("home.featured.description")}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        {featuredCollections.map((collection) => (
                            <Card
                                key={collection.key}
                                className="overflow-hidden border-none bg-card/80 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={collection.image}
                                        alt={collection.title}
                                        width={640}
                                        height={360}
                                        className="h-full w-full object-cover"
                                        sizes="(min-width: 768px) 30vw, 90vw"
                                    />
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t ${collection.gradient}`}
                                    />
                                    <Badge className="absolute left-4 top-4 bg-background/80 text-foreground shadow">
                                        {t(`home.categories.${collection.key}`)}
                                    </Badge>
                                </div>
                                <CardContent className="space-y-3 pb-6">
                                    <CardTitle className="text-lg">
                                        {collection.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {collection.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section id="spotlight" className="px-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {t("home.spotlight.title")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("home.spotlight.description")}
                        </p>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        {spotlightCards.map((item) => (
                            <Card
                                key={item.key}
                                className="h-full border border-border/60 bg-card/90 shadow-sm"
                            >
                                <CardHeader className="gap-4 pb-0">
                                    <Badge variant="secondary" className="w-fit">
                                        {item.badge}
                                    </Badge>
                                    <CardTitle className="text-lg">
                                        {item.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <div className="relative mt-6 h-40 overflow-hidden rounded-xl">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={480}
                                            height={320}
                                            className="h-full w-full object-cover"
                                            sizes="(min-width: 768px) 30vw, 90vw"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mx-4">
                    <Card className="relative overflow-hidden border bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent">
                        <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-12 left-6 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
                        <CardContent className="relative space-y-4 py-10">
                            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                {t("home.cta.title")}
                            </h3>
                            <p className="max-w-2xl text-muted-foreground">
                                {t("home.cta.description")}
                            </p>
                            <Button size="lg" asChild>
                                <Link href="/auth/signin">{t("home.cta.button")}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </>
    );
}
