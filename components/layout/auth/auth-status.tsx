"use client";

import { useSession } from "next-auth/react";
import { LoginButton } from "./login-button";
import { LogoutButton } from "./logout-button";
import { UserProfile } from "./user-profile";

export function AuthStatus() {
    const { data: session, status } = useSession();

    // Debug logging (client-side only)
    if (typeof window !== 'undefined') {
        console.log("=== AUTH STATUS DEBUG ===");
        console.log("Status:", status);
        console.log("Session:", session);
        console.log("All cookies:", document.cookie);
        console.log("NextAuth cookies:", document.cookie.split(';').filter(c => c.includes('authjs')));
        console.log("Backend cookies:", document.cookie.split(';').filter(c => c.includes('idsess')));

        // Test session API directly
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => console.log("Manual session API call:", data))
            .catch(err => console.error("Manual session API error:", err));

        console.log("========================");
    }

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (session) {
        return (
            <div className="space-y-4">
                <UserProfile />
                <LogoutButton />
            </div>
        );
    }

    return <LoginButton />;
}
