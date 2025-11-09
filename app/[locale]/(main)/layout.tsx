import Nav from "@/components/layout/nav/nav";
import { NavProvider } from "@/components/layout/nav/NavContext";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <Nav />
        <Toaster />
      </div>
    </NavProvider>
  );
}
