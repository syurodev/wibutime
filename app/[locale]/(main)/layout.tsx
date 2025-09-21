"use client";

import Nav from "@/components/layout/nav/nav";
import {
    NavigationProvider,
    useNavigation,
} from "@/contexts/navigation-context";

function MainLayoutContent({ children }: { children: React.ReactNode }) {
    const { navItems } = useNavigation();

    return (
        <main className="min-h-screen">
            <Nav items={navItems} />
            {children}
        </main>
    );
}

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NavigationProvider>
            <MainLayoutContent>{children}</MainLayoutContent>
        </NavigationProvider>
    );
}
