import {
    NavActionItem,
    NavItem,
    NavLinkItem,
} from "@/components/layout/nav/nav";
import { getNavConfig, navConfigs } from "@/components/layout/nav/nav-configs";

export function useNavConfig(pageName: keyof typeof navConfigs): NavItem[] {
    return getNavConfig(pageName);
}

// For custom navigation items
export function useCustomNav(items: NavItem[]): NavItem[] {
    return items;
}

// Helper to create action items
export function createActionItem(config: Omit<NavActionItem, "type">): NavItem {
    return {
        type: "action",
        ...config,
    };
}

// Helper to create link items
export function createLinkItem(config: Omit<NavLinkItem, "type">): NavItem {
    return {
        type: "link",
        ...config,
    };
}
