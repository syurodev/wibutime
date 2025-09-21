import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface AuthErrorPageProps {
    searchParams: Promise<{
        error?: string;
    }>;
}

export default async function AuthErrorPage({
    searchParams,
}: AuthErrorPageProps) {
    const { error } = await searchParams;

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-destructive">
                            Authentication Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <p className="text-sm">
                                {error
                                    ? `Error: ${error}`
                                    : "An authentication error occurred."}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Button asChild className="w-full">
                                <Link href="/auth/signin">Try Again</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <Link href="/">Back to Home</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
