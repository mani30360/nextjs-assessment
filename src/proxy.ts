import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

// Next.js 16 renamed Middleware to Proxy (`middleware.ts` -> `proxy.ts`); behaviour is the same.

const LOGIN_PATH = "/login";
const HOME_PATH = "/products";
const PROTECTED_PREFIXES = ["/products", "/cart"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!user && isProtected(pathname)) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === LOGIN_PATH || pathname === "/")) {
    return NextResponse.redirect(new URL(HOME_PATH, request.url));
  }

  if (!user && pathname === "/") {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/products/:path*", "/cart/:path*"],
};
