import type { Metadata } from "next";
import Header from "@/components/common/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Next.js starter template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header title="Dashboard" />
        <main className="container main">{children}</main>
      </body>
    </html>
  );
}
