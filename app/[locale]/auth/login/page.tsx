"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    // We intentionally ignore any identity `redirect_uri` query here.
    // After establishing the identity session cookie, we start a fresh OIDC flow.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const issuer = process.env.NEXT_PUBLIC_OIDC_ISSUER;
            if (!issuer) throw new Error("Missing NEXT_PUBLIC_OIDC_ISSUER");

            // Login directly to Identity with credentials and include cookies
            const response = await fetch(`${issuer}/api/v1/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || data?.success === false) {
                setError(data?.error?.message || "Invalid credentials");
                return;
            }

            // Session cookie is now set on the Identity domain. Continue with OIDC.
            // Use window.location to ensure proper redirect and avoid RSC payload issues
            const signInResult = await signIn("oidc", { callbackUrl: "/", redirect: false });

            if (signInResult?.url) {
                // Force full page navigation instead of client-side routing
                window.location.href = signInResult.url;
            } else {
                // Fallback if NextAuth doesn't provide URL
                await signIn("oidc", { callbackUrl: "/" });
            }
        } catch (err) {
            setError("Network error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Sign in to continue</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            You need to sign in to authorize the application
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            {error && (
                                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                                    {error}
                                </div>
                            )}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/auth/register"
                                    className="underline"
                                >
                                    Create one
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
