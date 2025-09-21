"use client";

import { useSetNavigation } from "@/contexts/navigation-context";
import { NavItem } from "./nav";

interface NavigationSetterProps {
    items: NavItem[];
}

export default function NavigationSetter({ items }: NavigationSetterProps) {
    useSetNavigation(items);
    return null; // This component doesn't render anything
}

// Alternative: Hook-based approach for client components
export function usePageNavigation(items: NavItem[]) {
    useSetNavigation(items);
}
