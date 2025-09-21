import {
    Calendar,
    Clock,
    Edit,
    Heart,
    HeartOff,
    Home,
    LogIn,
    LogOut,
    LucideIcon,
    MessageCircle,
    Save,
    Settings,
    Share2,
    Star,
    Timer,
    User,
    UserMinus,
    UserPlus,
    Users,
    X
} from "lucide-react";

// Icon registry for serialization
export const iconRegistry = {
    Calendar,
    Clock,
    Home,
    Settings,
    Timer,
    Users,
    Heart,
    HeartOff,
    UserPlus,
    UserMinus,
    Star,
    Edit,
    Save,
    X,
    Share2,
    MessageCircle,
    LogIn,
    LogOut,
    User,
} as const;

export type IconName = keyof typeof iconRegistry;

// Helper to get icon component by name
export function getIcon(iconName: IconName): LucideIcon {
    return iconRegistry[iconName];
}
