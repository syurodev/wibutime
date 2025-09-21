"use client";

import { useSetNavigation } from "@/contexts/navigation-context";
import { NavItem } from "./nav";

interface DynamicNavigationProps {
    children: React.ReactNode;
    getNavItems: () => NavItem[];
}

export default function DynamicNavigation({ children, getNavItems }: DynamicNavigationProps) {
    const navItems = getNavItems();
    useSetNavigation(navItems);

    return <>{children}</>;
}
