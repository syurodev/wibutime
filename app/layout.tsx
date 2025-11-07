import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WibuTime",
  description: "Multi-language web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
