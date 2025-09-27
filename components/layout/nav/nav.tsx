"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {hasAdminAccess} from "@/lib/auth/permissions";
import {getIcon, IconName} from "@/lib/icons";
import {AnimatePresence, motion, Variants} from "framer-motion";
import {Loader2, LogIn, LogOut, Search, Settings, Shield, User, X,} from "lucide-react";
import {signOut, useSession} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import AnimatedIcon from "./animated-icon";

export interface NavLinkItem {
  type: "link";
  icon: IconName;
  href: string;
  label: string;
}

export interface NavActionItem {
  type: "action";
  icon: IconName;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  activeIcon?: IconName;
  activeLabel?: string;
  variant?: "default" | "destructive" | "success";
  isLoading?: boolean;
}

export type NavItem = NavLinkItem | NavActionItem;

interface NavProps {
  items?: NavItem[];
}

const containerVariants: Variants = {
  hidden: {opacity: 0, x: -12},
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  closing: {
    opacity: 0,
    x: -12,
    transition: {
      duration: 0.2,
      delay: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {opacity: 0, scale: 0.8, y: 10},
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

const iconVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
  },
  hover: {
    scale: 1.05,
    opacity: 1,
    filter: "blur(0px)",
    transition: {duration: 0.2},
  },
};

const iconTransitionVariants: Variants = {
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hidden: {
    opacity: 0,
    filter: "blur(4px)",
    scale: 0.8,
    rotate: 10,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export default function Nav({items = []}: NavProps) {
  const {data: session} = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
      return;
    }

    setSearchQuery("");
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  return (
      <div className="fixed inset-x-0 bottom-4 z-[99999] flex justify-center">
        <div className="flex items-center gap-3">
          <motion.nav
              className={`relative flex h-12 items-center overflow-hidden rounded-full border border-gray-200/50 bg-background/60 shadow-lg backdrop-blur-md transition-colors duration-200 ${isSearchOpen ? "w-12 justify-center" : "px-2"}`}
              suppressHydrationWarning
              initial={{y: 100, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 35,
                delay: 0.1,
                layout: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
              }}
              layout
          >
            <motion.div
                className="flex w-full items-center gap-1"
                variants={containerVariants}
                initial="hidden"
                animate={isSearchOpen ? "closing" : "visible"}
                transition={{ease: "easeInOut", duration: 0.25}}
                style={{pointerEvents: isSearchOpen ? "none" : "auto"}}
            >
              <motion.div
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap={{scale: 0.95}}
                  layout
              >
                <Link
                    href="/"
                    className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100/80"
                    title="Home"
                >
                  <motion.div
                      variants={iconVariants}
                      initial="idle"
                      whileHover="hover"
                  >
                    <Image
                        src="/images/logo.png"
                        alt="wibutime"
                        width={20}
                        height={20}
                        className="object-cover"
                    />
                  </motion.div>
                </Link>
              </motion.div>

              <AnimatePresence mode="popLayout">
                {items.map((item, index) => {
                  if (item.type === "link") {
                    const Icon = getIcon(item.icon);
                    return (
                        <motion.div
                            key={`${item.type}-${item.href}-${index}`}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            whileHover="hover"
                            whileTap={{scale: 0.95}}
                            layout
                        >
                          <Link
                              href={item.href}
                              className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100/80"
                              title={item.label}
                          >
                            <motion.div
                                variants={iconVariants}
                                initial="idle"
                                animate="idle"
                                whileHover="hover"
                            >
                              <Icon className="h-5 w-5 transition-colors duration-200"/>
                            </motion.div>
                          </Link>
                        </motion.div>
                    );
                  }

                  if (item.type === "action") {
                    const label =
                        item.isActive && item.activeLabel
                            ? item.activeLabel
                            : item.label;

                    const getVariantStyles = () => {
                      switch (item.variant) {
                        case "destructive":
                          return item.isActive
                              ? "text-red-600 hover:text-red-700"
                              : "hover:text-red-600";
                        case "success":
                          return item.isActive
                              ? "text-green-600 hover:text-green-700"
                              : "hover:text-green-600";
                        default:
                          return item.isActive
                              ? "text-blue-600 hover:text-blue-700"
                              : "hover:text-gray-900";
                      }
                    };

                    return (
                        <motion.div
                            key={`${item.type}-${item.label}-${index}`}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            whileHover={!item.isLoading ? "hover" : undefined}
                            whileTap={!item.isLoading ? {scale: 0.9} : {}}
                            layout
                        >
                          <motion.button
                              onClick={item.onClick}
                              disabled={item.isLoading}
                              className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100/80 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                              title={label}
                              whileHover={!item.isLoading ? "hover" : undefined}
                              whileTap={!item.isLoading ? {scale: 0.95} : {}}
                              type="button"
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.div
                                  key={item.isLoading ? "loading" : "idle"}
                                  variants={iconTransitionVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                              >
                                {item.isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-gray-500"/>
                                ) : (
                                    <AnimatedIcon
                                        icon={item.isActive && item.activeIcon ? item.activeIcon : item.icon}
                                        className={`transition-colors duration-200 ${getVariantStyles()}`}
                                        size={20}
                                    />
                                )}
                              </motion.div>
                            </AnimatePresence>
                          </motion.button>
                        </motion.div>
                    );
                  }

                  return null;
                })}
              </AnimatePresence>

              <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap={{scale: 0.95}}
                  layout
              >
                {session ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button
                            className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100/80 outline-none"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                          <motion.div
                              variants={iconVariants}
                              initial="idle"
                              animate="idle"
                              whileHover="hover"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                  src={session.user?.image || ""}
                                  alt={session.user?.name || "User"}
                              />
                              <AvatarFallback className="text-xs font-medium">
                                {session.user?.name?.charAt(0) ||
                                    session.user?.email?.charAt(0) ||
                                    "U"}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                          align="end"
                          className="w-56"
                          sideOffset={8}
                      >
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {session.user?.name || "User"}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {session.user?.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                          <Link
                              href="/profile"
                              className="flex items-center"
                          >
                            <User className="mr-2 h-4 w-4"/>
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                              href="/settings"
                              className="flex items-center"
                          >
                            <Settings className="mr-2 h-4 w-4"/>
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        {hasAdminAccess(session) && (
                            <DropdownMenuItem asChild>
                              <Link
                                  href="/admin/system"
                                  className="flex items-center"
                              >
                                <Shield className="mr-2 h-4 w-4"/>
                                System Management
                              </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            onClick={() => signOut({callbackUrl: "/"})}
                            className="text-red-600 focus:text-red-600"
                        >
                          <LogOut className="mr-2 h-4 w-4"/>
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link
                        href="/auth/login"
                        className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100/80"
                        title="Login"
                    >
                      <motion.div
                          variants={iconVariants}
                          initial="idle"
                          animate="idle"
                          whileHover="hover"
                      >
                        <LogIn
                            className="h-5 w-5 text-gray-600 transition-colors duration-200 group-hover:text-gray-900"/>
                      </motion.div>
                    </Link>
                )}
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {isSearchOpen && (
                  <motion.button
                      key="nav-close"
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-background/80 transition-colors duration-200 bg-transparent"
                      initial={{opacity: 0, scale: 0.6}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0, scale: 0.6}}
                      transition={{duration: 0.2, delay: 0.15}}
                      aria-label="Đóng tìm kiếm"
                      type="button"
                  >
                    <X className="h-5 w-5 text-gray-700"/>
                  </motion.button>
              )}
            </AnimatePresence>
          </motion.nav>

          <motion.div
              className="flex h-12 items-center"
              layout
              transition={{layout: {duration: 0.25, ease: "easeInOut"}}}
          >
            <motion.div
                className="flex h-12 items-center overflow-hidden rounded-full border border-gray-200/50 bg-background/60 shadow-lg backdrop-blur-md"
                animate={{width: isSearchOpen ? 304 : 48}}
                transition={{type: "spring", stiffness: 240, damping: 28, delay: isSearchOpen ? 0.05 : 0}}
                layout
            >
              <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center"
                  aria-label="Mở tìm kiếm"
                  aria-expanded={isSearchOpen}
                  disabled={isSearchOpen}
              >
                <Search className="h-5 w-5 text-gray-700"/>
              </button>
              <AnimatePresence initial={false}>
                {isSearchOpen && (
                    <motion.div
                        key="search-field"
                        className="flex flex-1 items-center gap-2 pr-4"
                        initial={{opacity: 0, x: 12}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 12}}
                        transition={{duration: 0.18, delay: 0.1}}
                    >
                      <input
                          ref={searchInputRef}
                          value={searchQuery}
                          onChange={(event) => setSearchQuery(event.target.value)}
                          placeholder="Nhập từ khóa..."
                          className="w-full bg-transparent text-sm placeholder:text-gray-400 outline-none"
                          aria-label="Tìm kiếm"
                      />
                    </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
  );
}
