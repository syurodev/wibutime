'use client';

import { cn } from '@/commons/utils/tailwind.util';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Bolt,
  ChevronLeft,
  ChevronRight,
  CopyPlus,
  Ellipsis,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { NOVEL_TABS, Tab, TABS } from '@/commons/constants/routes/navigation';
import useRouteName, { RouteName } from '@/hooks/use-route-name';
import { useScreenSize } from '@/hooks/use-screen-size';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';
import { ThemeSwitcher } from '@workspace/ui/components/theme-switcher';
import Comment from './Comment';
import History from './History';

interface Separator {
  type: 'separator';
  title?: never;
  icon?: never;
}

export type TabItem = Tab | Separator;

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: '.5rem',
    paddingRight: '.5rem',
    opacity: 0,
    y: -20,
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? '.5rem' : 0,
    paddingLeft: isSelected ? '1rem' : '.5rem',
    paddingRight: isSelected ? '1rem' : '.5rem',
    opacity: 1,
    y: 0,
  }),
  exit: {
    gap: 0,
    paddingLeft: '.5rem',
    paddingRight: '.5rem',
    opacity: 0,
    y: -20,
  },
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: 'auto', opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = (delay?: number) => ({
  delay: delay ?? 0.1,
  type: 'spring',
  bounce: 0,
  duration: 0.6,
});

const DEFAULT_ROUTE = ['HOME', 'ANIME', 'MANGA', 'NOVELS'];

export function MagicBar() {
  const router = useRouter();
  const routeName = useRouteName();
  const screenSize = useScreenSize();

  const [selected, setSelected] = React.useState<RouteName | null>(null);
  const [isOpenSearch, setIsOpenSearch] = React.useState<boolean>(false);
  const [isOpenComment, setIsOpenComment] = React.useState<boolean>(false);
  const [isOpenHistory, setIsOpenHistory] = React.useState<boolean>(false);
  const [isFavorite, setIsFavorite] = React.useState<boolean>(false);
  const [isOpenMainMenu, setIsOpenMainMenu] = React.useState<boolean>(false);

  const handleSelect = (routeName: RouteName, value: Tab) => {
    if (routeName === 'SEARCH') {
      setIsOpenSearch(true);
    } else {
      setSelected(routeName);
      if (value.href) {
        router.push(value.href);
      }
    }
  };

  React.useEffect(() => {
    if (routeName === 'SEARCH') {
      setIsOpenSearch(true);
    } else {
      if (!DEFAULT_ROUTE.includes(routeName)) {
        setIsOpenMainMenu(false);
      }
      setSelected(routeName);
    }
  }, [routeName]);

  const handleFunc = async (tab: Tab) => {
    switch (tab.func) {
      case 'FAVORITE':
        setIsFavorite(!isFavorite);
        break;
      case 'COMMENT':
        setIsOpenComment(true);
        break;
      case 'HISTORY':
        setIsOpenHistory(true);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <nav
        className={cn(
          'flex items-center justify-between fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        )}
      >
        <div className="flex items-center gap-2">
          <motion.div
            layout
            className={cn(
              'flex flex-wrap items-center gap-2 rounded-2xl border dark:bg-background/80 bg-background/70 p-1 shadow-sm backdrop-blur-md',
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpenSearch ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.2,
                    delay: 0,
                    easeInOut: 'easeInOut',
                  }}
                  className="w-full px-2"
                >
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-transparent border-none shadow-none focus-visible:ring-0"
                    autoFocus
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="tabs"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-nowrap items-center gap-2"
                >
                  {!DEFAULT_ROUTE.includes(routeName) && !isOpenMainMenu && (
                    <motion.button
                      variants={buttonVariants}
                      initial={false}
                      animate="animate"
                      onClick={() => setIsOpenMainMenu(true)}
                      transition={transition}
                      className={cn(
                        'relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <ChevronLeft size={20} />
                    </motion.button>
                  )}

                  {!DEFAULT_ROUTE.includes(routeName) && !isOpenMainMenu
                    ? NOVEL_TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <motion.button
                            key={tab.title}
                            variants={buttonVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            custom={selected === tab.key}
                            onClick={() => handleFunc(tab)}
                            transition={transition}
                            className={cn(
                              'relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300',
                              selected === tab.key
                                ? cn('bg-muted text-primary')
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                          >
                            {Icon && (
                              <Icon
                                size={20}
                                className={cn(
                                  'transition-colors duration-300',
                                  tab.func === 'FAVORITE' && isFavorite
                                    ? 'text-rose-500'
                                    : '',
                                )}
                              />
                            )}
                          </motion.button>
                        );
                      })
                    : TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <motion.button
                            key={tab.title}
                            variants={buttonVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            custom={selected === tab.key}
                            onClick={() => handleSelect(tab.key, tab)}
                            transition={transition}
                            className={cn(
                              'relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300',
                              selected === tab.key
                                ? cn('bg-muted text-primary')
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                          >
                            {Icon && <Icon size={20} />}

                            <AnimatePresence initial={false}>
                              {selected === tab.key &&
                                screenSize.greaterThan('xs') && (
                                  <motion.span
                                    variants={spanVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={transition}
                                    className="overflow-hidden line-clamp-1"
                                  >
                                    {tab.title}
                                  </motion.span>
                                )}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}

                  {!DEFAULT_ROUTE.includes(routeName) && isOpenMainMenu && (
                    <motion.button
                      variants={buttonVariants}
                      initial={false}
                      animate="animate"
                      onClick={() => setIsOpenMainMenu(false)}
                      transition={transition}
                      className={cn(
                        'relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <ChevronRight size={20} />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            layout
            className={cn(' rounded-2xl border bg-background p-1 shadow-sm')}
          >
            {isOpenSearch ? (
              <motion.button
                key={'more'}
                variants={buttonVariants}
                initial={false}
                animate="animate"
                onClick={() => setIsOpenSearch(false)}
                transition={transition}
                className={cn(
                  'relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300',
                )}
              >
                <X size={20} />
              </motion.button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    key={'more'}
                    variants={buttonVariants}
                    initial={false}
                    animate="animate"
                    onClick={() => console.log('more')}
                    transition={transition}
                    className={cn(
                      'relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300',
                    )}
                  >
                    <Ellipsis size={20} />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <CopyPlus
                        size={16}
                        strokeWidth={2}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bolt
                        size={16}
                        strokeWidth={2}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <ThemeSwitcher />
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </motion.div>
        </div>
      </nav>

      <Comment isOpen={isOpenComment} setIsOpen={setIsOpenComment} />
      <History isOpen={isOpenHistory} setIsOpen={setIsOpenHistory} />
    </>
  );
}
