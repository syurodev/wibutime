import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"

import '@/app/globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

const poppins = Noto_Sans({ subsets: ['vietnamese'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })

export const metadata: Metadata = {
  title: 'WibuTime',
  description: 'Đọc Light Novel, Manga, xem Anime online, bình luận. Thư viện Light Novel, Manga, Anime Tiếng Việt chất lượng cao, cập nhật liên tục.',
  manifest: "/manifest.json",
  icons: { apple: 'icon.png' }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await auth();

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${poppins.className} w-screen`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
          >
            {children}
            <Analytics />
            <SpeedInsights />
            <Toaster />
            {/* <Footer /> */}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
