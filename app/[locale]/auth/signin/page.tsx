import { LoginButton } from "@/components/layout/auth/login-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Sign In</CardTitle>
                        <p className="text-muted-foreground">
                            Sign in to your account using OAuth2/OIDC
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <LoginButton className="w-full" />
                        <div className="text-center text-sm text-muted-foreground">
                            or
                        </div>
                        <Link href="/auth/login" className="w-full block">
                            <Button variant="secondary" className="w-full">
                                Sign in with email
                            </Button>
                        </Link>
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/auth/register"
                                    className="underline"
                                >
                                    Create one
                                </Link>
                            </div>
                            <Link
                                href="/"
                                className="text-sm text-muted-foreground hover:underline block mt-2"
                            >
                                Back to home
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
