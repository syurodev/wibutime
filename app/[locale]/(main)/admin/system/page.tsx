import { hasAdminAccess } from "@/lib/auth/permissions";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Users, Tag, Palette, Settings } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SystemPageProps {
    params: Promise<{ locale: string }>;
}

export default async function SystemPage({ params }: SystemPageProps) {
    const session = await auth();
    const { locale } = await params;

    if (!hasAdminAccess(session)) {
        redirect(`/${locale}/auth/signin`);
    }

    const managementCards = [
        {
            title: "Genres",
            description: "Cấu hình nhóm thể loại và danh mục nội dung.",
            href: `/admin/system/genres`,
            icon: Tag,
            accent: "bg-blue-100 text-blue-600",
        },
        {
            title: "Characters",
            description: "Quản lý hồ sơ nhân vật và quan hệ liên quan.",
            href: `/admin/system/characters`,
            icon: Users,
            accent: "bg-emerald-100 text-emerald-600",
        },
        {
            title: "Creators",
            description: "Thông tin tác giả, hoạ sĩ, studio và đội ngũ sáng tạo.",
            href: `/admin/system/creators`,
            icon: Palette,
            accent: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <section className="container mx-auto flex max-w-5xl flex-col gap-10 py-10">
            <header className="flex flex-col items-center gap-3 text-center">
                <div className="flex items-center gap-3 text-blue-600">
                    <Shield className="h-8 w-8" />
                    <h1 className="text-3xl font-semibold text-foreground">
                        System Management
                    </h1>
                </div>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    Quản lý dữ liệu nền tảng (master data) và thông tin cấu hình hệ
                    thống.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {managementCards.map((card) => {
                    const IconComponent = card.icon;
                    const targetHref = `/${locale}${card.href}`;

                    return (
                        <Link key={targetHref} href={targetHref} className="block h-full">
                            <Card className="h-full">
                                <CardHeader className="flex items-start gap-4">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${card.accent}`}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <CardTitle className="text-base">
                                            {card.title}
                                        </CardTitle>
                                        <CardDescription>
                                            {card.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Settings className="h-3.5 w-3.5" />
                                        <span className="truncate font-mono">
                                            {card.href}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <Card className="border-dashed">
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle className="text-base">Vai trò và quyền hiện tại</CardTitle>
                        <CardDescription>
                            Thông tin được lấy từ phiên đăng nhập hiện tại.
                        </CardDescription>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="grid gap-6 py-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase text-muted-foreground">
                            Global Roles
                        </p>
                        <div className="min-h-5 text-sm">
                            {session?.globalRoleNames?.length ? (
                                <span className="font-medium text-primary">
                                    {session.globalRoleNames.join(", ")}
                                </span>
                            ) : (
                                <span className="text-muted-foreground">None</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase text-muted-foreground">
                            Global Permissions
                        </p>
                        <div className="text-sm font-mono text-primary">
                            {session?.globalPermissions?.length || 0}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
