/**
 * Homepage - WibuTime
 * Hero section only, other sections are parallel routes
 */

import { HomeNavigation } from "@/features/home/components/home-navigation";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "WibuTime - Anime, Manga & Novel Platform",
  description:
    "Discover and read the latest anime, manga, and novels. Join thousands of readers and creators on WibuTime.",
  keywords: ["anime", "manga", "novel", "read online", "wibutime"],
};

export default function HomePage() {
  return (
    <div className="relative w-full h-full">
      {/* Navigation Setup (Client Component) */}
      <HomeNavigation />

      {/* Event Hero Image - fills the bento card */}
      <Image
        src="/images/img-1.jpeg"
        alt="Featured Event"
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
      />

      {/* Optional: Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}
