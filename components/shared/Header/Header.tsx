'use client'

import { FC, memo, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { background, opacity } from './anim'
import Lottie from "lottie-react";
import { Button, buttonVariants } from "@/components/ui/button"
import { LuSearch, LuCoins } from "react-icons/lu";
import dynamic from 'next/dynamic'

import logoAnimation from '@/lib/logoAnimation.json'
import styles from './styles.module.scss'
import Nav from './Nav/Nav'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import UserMenu from './UserMenu/UserMenu'
import { coinsFormat } from '@/lib/coinsFormat'
import BlockLeak from '../BlockLeak/BlockLeak'

const SearchCommand = dynamic(() => import('@/components/shared/SearchCommand/SearchCommand'), {
  ssr: true,
});
const CoinsMenu = dynamic(() => import('@/components/shared/CoinsMenu/CoinsMenu'), {
  ssr: true,
});

const Header: FC = () => {
  const session = useCurrentUser()
  const [isActive, setIsActive] = useState<boolean>(false)
  const [openSearch, setOpenSearch] = useState<boolean>(false)
  const [openCoinsMenu, setOpenCoinsMenu] = useState<boolean>(false)
  const navRef = useRef<HTMLElement>(null)

  const handleChangeNavBG = () => {
    if (window.scrollY >= 1) {
      navRef.current?.classList.add("shadow-sm")
    } else {
      navRef.current?.classList.remove("shadow-sm")
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleChangeNavBG);

    return () => {
      window.removeEventListener('scroll', handleChangeNavBG);
    };
  }, [])

  return (
    <>
      <nav ref={navRef}
        className={`${styles.header} ${isActive ? "bg-background supports-[backdrop-filter]:bg-background" : "bg-background/40 supports-[backdrop-filter]:bg-background/40"} backdrop-blur-lg p-3 z-50 transition-all duration-200 ease-in-out w-screen`}
      >
        <div
          className={`${styles.bar} ${isActive ? "max-w-[1500px]" : "max-w-[1400px]"} w-full mx-auto transition-all delay-75 duration-1000`}
        // className={`${styles.bar} w-screen`}
        >
          <Link
            href={"/"}
            className='relative h-[36px] flex items-center justify-start pl-10 overflow-hidden'
            scroll
            onClick={() => setIsActive(false)}
          >
            <Lottie animationData={logoAnimation} loop={false} className='absolute size-44 -left-[75px]' />
            <span className='font-semibold'>Wibutime</span>
          </Link>

          <div className='flex items-center gap-3'>
            <div onClick={() => { setIsActive(!isActive) }} className={`${styles.el} min-w-8 min-h-8`}>
              <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""} before:bg-black dark:before:bg-white after:bg-black 
          dark:after:bg-white`}></div>
              <div className={`${styles.label} hidden md:flex`}>
                <motion.p variants={opacity} animate={!isActive ? "open" : "closed"}>Menu</motion.p>
                <motion.p variants={opacity} animate={isActive ? "open" : "closed"}>Close</motion.p>
              </div>
            </div>

            <Button onClick={() => setOpenSearch(true)} size={"icon"} variant={"ghost"}>
              <LuSearch className="text-lg" />
            </Button>
          </div>

          <motion.div
            variants={opacity}
            animate={isActive ? "closed" : "open"}
            className={styles.userContainer}
          >
            <div className={styles.user}>
              {
                session ? (
                  <div className='gap-3 items-center flex'>
                    <Button
                      rounded={"full"}
                      variant={"outline"}
                      className='bg-background/50 dark:bg-background/30 hidden md:flex'
                      onClick={() => setOpenCoinsMenu(true)}
                    >
                      <span className='text-sm font-semibold'>{session.coins ? coinsFormat(session.coins) : 0}</span>
                      <LuCoins className="ml-1 text-lg" />
                    </Button>

                    <UserMenu />
                  </div>
                ) : (
                  <Link
                    href={"/auth/login"}
                    className={`${buttonVariants({ variant: "outline" })} !rounded-full`}>
                    Đăng nhập
                  </Link>
                )
              }
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={background}
          initial="initial"
          animate={isActive ? "open" : "closed"}
          className={`${styles.background} bg-black z-40`}
          onClick={() => setIsActive(false)}
        ></motion.div>

        <AnimatePresence mode='wait'>
          {isActive && <Nav setIsActive={setIsActive} />}
        </AnimatePresence>
      </nav>

      {/* {
          openSearch && (
            )
          } */}
      <SearchCommand
        open={openSearch}
        setOpen={setOpenSearch}
      />

      {
        session && (
          <CoinsMenu
            coins={session?.coins ?? 0}
            open={openCoinsMenu}
            setOpen={setOpenCoinsMenu}
          />
        )
      }

      {/* <BlockLeak /> */}
    </>
  )
}

export default memo(Header)