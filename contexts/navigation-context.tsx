"use client";

import { NavItem } from "@/components/layout/nav/nav";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

interface NavigationContextType {
    navItems: NavItem[];
    setNavItems: (items: NavItem[]) => void;
    updateNavItems: (updater: (items: NavItem[]) => NavItem[]) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
    undefined,
);

export function NavigationProvider({ children }: { children: ReactNode }) {
    const [navItems, setNavItems] = useState<NavItem[]>([]);

    const setNavItemsCallback = useCallback((items: NavItem[]) => {
        setNavItems(items);
    }, []);

    const updateNavItems = useCallback(
        (updater: (items: NavItem[]) => NavItem[]) => {
            setNavItems((current) => updater(current));
        },
        [],
    );

    return (
        <NavigationContext.Provider
            value={{
                navItems,
                setNavItems: setNavItemsCallback,
                updateNavItems,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error(
            "useNavigation must be used within a NavigationProvider",
        );
    }
    return context;
}

// Hook for pages to set their navigation
export function useSetNavigation(items: NavItem[]) {
    const { setNavItems } = useNavigation();
    const prevItemsRef = useRef<string>("");

    // Memoize items to prevent unnecessary re-renders
    const memoizedItems = useMemo(() => items, [JSON.stringify(items)]);

    // Set navigation items when component mounts or items change
    useEffect(() => {
        const itemsString = JSON.stringify(memoizedItems);
        if (prevItemsRef.current !== itemsString) {
            setNavItems(memoizedItems);
            prevItemsRef.current = itemsString;
        }
    }, [memoizedItems, setNavItems]);
}
