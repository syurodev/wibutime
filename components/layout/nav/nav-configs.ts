import { NavItem } from "./nav";

// Predefined navigation configurations for different pages
export const navConfigs = {
    // Home/Dashboard page - general navigation
    home: [
        {
            type: "link",
            icon: "User",
            href: "/users",
            label: "Users",
        },
    ] as NavItem[],

    // Timer page - timer related actions
    timer: [
        { type: "link", icon: "Home", href: "/", label: "Home" },
        {
            type: "link",
            icon: "Calendar",
            href: "/schedule",
            label: "Schedule",
        },
        {
            type: "link",
            icon: "Settings",
            href: "/timer/settings",
            label: "Timer Settings",
        },
    ] as NavItem[],

    // Schedule page - schedule related actions
    schedule: [
        { type: "link", icon: "Home", href: "/", label: "Home" },
        { type: "link", icon: "Timer", href: "/timer", label: "Timer" },
        {
            type: "link",
            icon: "Calendar",
            href: "/schedule/calendar",
            label: "Calendar View",
        },
    ] as NavItem[],

    // Settings page - settings navigation
    settings: [
        { type: "link", icon: "Home", href: "/", label: "Home" },
        { type: "link", icon: "Clock", href: "/timer", label: "Timer" },
        {
            type: "link",
            icon: "Calendar",
            href: "/schedule",
            label: "Schedule",
        },
    ] as NavItem[],

    // Profile page - profile related actions
    profile: [
        {
            type: "link",
            icon: "Settings",
            href: "/settings",
            label: "Settings",
        },
        { type: "link", icon: "Users", href: "/users", label: "Users" },
    ] as NavItem[],

    // Users management page
    users: [
        {
            type: "link",
            icon: "Settings",
            href: "/settings",
            label: "Settings",
        },
    ] as NavItem[],

    // Auth pages - minimal navigation
    auth: [] as NavItem[],
};

// Helper function to get navigation config by page name
export function getNavConfig(pageName: keyof typeof navConfigs): NavItem[] {
    return navConfigs[pageName] || navConfigs.home;
}
