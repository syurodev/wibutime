import { MagicBar } from '@/components/MagicBar';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MagicBar />
      <main className="min-h-dvh">{children}</main>
      {/* <Footer /> */}
    </>
  );
}
