import type { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import StoreProvider from "@/store/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ShopDemo",
    template: "%s · ShopDemo",
  },
  description: "Next.js + Redux Toolkit product catalogue and cart",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const user = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  return (
    <html lang="en">
      <body>
        <StoreProvider initialUser={user}>
          <Header />
          <main className="container main">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
