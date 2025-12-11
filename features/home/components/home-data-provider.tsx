"use client";

import { createContext, use, type ReactNode } from "react";
import type { HomeData } from "../types";

/**
 * Context for home data Promise
 * Uses React use() pattern for Suspense-friendly data sharing
 */
const HomeDataContext = createContext<Promise<HomeData> | null>(null);

/**
 * Props for HomeDataProvider
 */
interface HomeDataProviderProps {
  children: ReactNode;
  homeDataPromise: Promise<HomeData>;
}

/**
 * Provider that passes home data Promise to children
 * Children can use the useHomeData hook to access data with Suspense
 */
export function HomeDataProvider({
  children,
  homeDataPromise,
}: HomeDataProviderProps) {
  return (
    <HomeDataContext.Provider value={homeDataPromise}>
      {children}
    </HomeDataContext.Provider>
  );
}

/**
 * Hook to access home data using React use() pattern
 * Must be used within HomeDataProvider
 * Will suspend until data is available
 *
 * @example
 * function TrendingSection() {
 *   const { trending } = useHomeData();
 *   return <Grid items={trending} />;
 * }
 */
export function useHomeData(): HomeData {
  const promise = use(HomeDataContext);
  if (!promise) {
    throw new Error("useHomeData must be used within HomeDataProvider");
  }
  return use(promise);
}
