import { LogoutButton } from "@/components/layout/auth/logout-button";
import { UserProfile } from "@/components/layout/auth/user-profile";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

interface ProtectedPageProps {
    params: Promise<{ locale: string }>;
}

export default async function ProtectedPage({ params }: ProtectedPageProps) {
    const session = await auth();
    const { locale } = await params;

    if (!session) {
        redirect(`/${locale}/auth/signin`);
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Protected Page</h1>
                    <p className="text-muted-foreground mt-2">
                        This page is only accessible to authenticated users.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-6">
                    <UserProfile />
                    <LogoutButton />
                </div>

                <div className="bg-muted p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">
                        Session Information
                    </h2>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
