'use client'

import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoEyeOutline } from "react-icons/io5";
import { GoHeart } from "react-icons/go";
import { motion } from 'framer-motion';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { slide } from '@/lib/motion/slide'

type IProps = {
  data: {
    animes: TrendingData[];
    mangas: TrendingData[];
    lightnovels: TrendingData[];
  }
}

const Trending: FC<IProps> = ({ data }) => {

  return (
    <div>
      <motion.div
        className='w-full h-fit overflow-hidden relative rounded-2xl shadow dark:border'
        variants={slide}
        custom={0.2}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className='w-full h-[32dvh] lg:h-[60dvh] lg:min-h-[500px] min-h-[295px] overflow-hidden relative'>
          <Tabs defaultValue="anime" className="w-full h-full">
            <TabsList className='w-full h-fit rounded-none'>
              <TabsTrigger value="anime">Anime</TabsTrigger>
              <TabsTrigger value="manga">Manga</TabsTrigger>
              <TabsTrigger value="lightnovel">Lightnovel</TabsTrigger>
            </TabsList>
            {/* Anime */}
            <TabsContent value="anime" className='h-[calc(100%-40px)]'>
              <div
                className='flex flex-wrap justify-between h-full w-full px-2'
              >
                {
                  data.animes.length > 0 ? data.animes.map((item, index) => {
                    return (
                      <motion.div
                        key={`animetranding-${index}`}
                        variants={slide}
                        custom={0.25 + (index * 0.1)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className='flex gap-2 w-1/2 lg:w-full px-1'
                      >
                        <Link
                          href={`/animes/anime/${item.id}`}
                          className='flex gap-2 w-full'
                          scroll
                        >
                          <div className='min-w-8 h-12 relative rounded-md overflow-hidden'>
                            <Image
                              src={item.image ? item.image.url : "/images/image2.jpeg"}
                              alt={item.name}
                              fill
                              sizes='50px'
                              className='object-cover'
                              priority
                            />
                          </div>

                          <div className='flex flex-col w-full'>
                            <p className='line-clamp-1'>{item.name}</p>

                            <div className='grid grid-cols-2 gap-3 text-secondary-foreground font-medium'>
                              <div className='flex items-center gap-1'>
                                <IoEyeOutline />
                                <span className='text-xs'>{item.totalviews}</span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <GoHeart />
                                <span className='text-xs'>{item.numfavorites}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  }) : (
                    <p className='text-center'>Không có dữ liệu</p>
                  )
                }
              </div>
            </TabsContent>

            {/* Manga */}
            <TabsContent value="manga" className='h-[calc(100%-40px)]'>
              <div
                className='flex flex-wrap justify-between h-full w-full px-2'
              >
                {
                  data.mangas.length > 0 ? data.mangas.map((item, index) => {
                    return (
                      <motion.div
                        key={`mangatranding-${index}`}
                        variants={slide}
                        custom={0.25 + (index * 0.1)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className='flex gap-2 w-1/2 lg:w-full px-3'
                      >
                        <Link
                          href={`/mangas/manga/${item.id}`}
                          className='flex gap-1 w-full'
                          scroll
                        >
                          <div className='min-w-8 h-12 relative rounded-md overflow-hidden'>
                            <Image
                              src={item.image ? item.image.url : "/images/image2.jpeg"}
                              alt={item.name}
                              fill
                              sizes='full'
                              className='object-cover'
                            />
                          </div>

                          <div className='flex flex-col w-full'>
                            <p className='line-clamp-1'>{item.name}</p>

                            <div className='grid grid-cols-2 gap-3 text-secondary-foreground font-medium'>
                              <div className='flex items-center gap-1'>
                                <IoEyeOutline />
                                <span className='text-xs line-clamp-1'>{item.totalviews}</span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <GoHeart />
                                <span className='text-xs line-clamp-1'>{item.numfavorites}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  }) : (
                    <p className='text-center'>Không có dữ liệu</p>
                  )
                }
              </div>
            </TabsContent>

            {/* lightnovel */}
            <TabsContent value="lightnovel" className='h-[calc(100%-40px)]'>
              <div
                className='flex flex-wrap justify-between h-full w-full px-2'
              >
                {
                  data.lightnovels.length > 0 ? data.lightnovels.map((item, index) => {
                    return (
                      <motion.div
                        key={`lightnoveltranding-${index}`}
                        variants={slide}
                        custom={0.25 + (index * 0.1)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className='flex gap-2 w-1/2 lg:w-full px-1'
                      >
                        <Link
                          href={`/lightnovels/lightnovel/${item.id}`}
                          className='flex gap-2 w-full'
                          scroll
                        >
                          <div className='min-w-8 w-8 h-12 relative rounded-md overflow-hidden'>
                            <Image
                              src={item.image ? item.image.url : "/images/image2.jpeg"}
                              alt={item.name}
                              fill
                              sizes='full'
                              className='object-cover'
                            />
                          </div>

                          <div className='flex flex-col w-full'>
                            <p className='line-clamp-1'>{item.name}</p>

                            <div className='grid grid-cols-2 gap-3 text-secondary-foreground font-medium'>
                              <div className='flex items-center gap-1'>
                                <IoEyeOutline />
                                <span className='text-xs'>{item.totalviews}</span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <GoHeart />
                                <span className='text-xs'>{item.numfavorites}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  }) : (
                    <p className='text-center'>Không có dữ liệu</p>
                  )
                }
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

    </div>

  )
}

export default Trending