import { hasAdminAccess } from "@/lib/auth/permissions";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Users, Tag, Palette } from "lucide-react";

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
            title: "Genres Management",
            description: "Manage content genres and categories",
            href: `/admin/system/genres`,
            icon: Tag,
            color: "bg-blue-500"
        },
        {
            title: "Characters Management",
            description: "Manage characters across all content",
            href: `/admin/system/characters`,
            icon: Users,
            color: "bg-green-500"
        },
        {
            title: "Creators Management",
            description: "Manage authors, artists, studios and creators",
            href: `/admin/system/creators`,
            icon: Palette,
            color: "bg-purple-500"
        }
    ];

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-blue-600 mr-2" />
                        <h1 className="text-3xl font-bold">System Management</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Manage master data and system configurations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {managementCards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="group block"
                            >
                                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20 group-hover:scale-[1.02]">
                                    <div className="flex items-center mb-4">
                                        <div className={`p-2 rounded-lg ${card.color} text-white`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold ml-3 group-hover:text-primary transition-colors">
                                            {card.title}
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        {card.description}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">
                        Current Permissions
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Global Roles:</strong>
                            <div className="mt-1">
                                {session?.globalRoleNames?.length ? (
                                    <span className="text-primary">
                                        {session.globalRoleNames.join(", ")}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">None</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <strong>Global Permissions Count:</strong>
                            <div className="mt-1">
                                <span className="text-primary font-mono">
                                    {session?.globalPermissions?.length || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}