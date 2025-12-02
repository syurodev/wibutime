import Nav from "@/components/layout/nav/nav";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <Nav />
      <Toaster position="top-right" />
    </div>
  );
}
