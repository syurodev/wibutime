"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface LogoutButtonProps {
    children?: React.ReactNode;
    className?: string;
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
}

export function LogoutButton({
    children,
    className,
    variant = "outline",
}: LogoutButtonProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            const issuer = process.env.NEXT_PUBLIC_OIDC_ISSUER;

            if (!issuer) {
                console.warn("NEXT_PUBLIC_OIDC_ISSUER not configured, skipping backend logout");
                return;
            }

            console.log("Calling backend logout...");
            console.log("NEXT_PUBLIC_OIDC_ISSUER value:", issuer);

            const response = await fetch(`${issuer}/api/v1/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                console.log("Backend logout completed successfully");
            } else {
                console.warn("Backend logout failed with status:", response.status);
            }
        } catch (error) {
            console.error("Backend logout failed:", error);
        }

        try {
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            console.error("NextAuth signOut failed:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Button
            onClick={handleLogout}
            variant={variant}
            className={className}
            disabled={isLoggingOut}
        >
            {isLoggingOut ? "Signing out..." : (children || "Sign Out")}
        </Button>
    );
}
