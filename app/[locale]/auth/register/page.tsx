"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const issuer = process.env.NEXT_PUBLIC_OIDC_ISSUER;
            if (!issuer) throw new Error("Missing NEXT_PUBLIC_OIDC_ISSUER");

            // Create account on Identity
            const res = await fetch(`${issuer}/api/v1/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    username,
                    display_name: displayName,
                    password,
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || data?.success === false) {
                setError(data?.error?.message || "Registration failed");
                return;
            }

            // Auto-login to Identity to establish session cookie (cross-site)
            const loginRes = await fetch(`${issuer}/api/v1/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!loginRes.ok) {
                // If auto-login fails, send user to sign in page
                router.push("/auth/login");
                return;
            }

            // Continue with OIDC code flow via NextAuth
            await signIn("oidc", { callbackUrl: "/" });
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
                        <CardTitle>Create your account</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Register with your email and password
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
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="displayName">
                                    Display name
                                </Label>
                                <Input
                                    id="displayName"
                                    value={displayName}
                                    onChange={(e) =>
                                        setDisplayName(e.target.value)
                                    }
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
                                {loading
                                    ? "Creating account..."
                                    : "Create account"}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="underline">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
