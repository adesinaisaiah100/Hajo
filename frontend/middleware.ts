import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/provider", "/customer"];
const AUTH_PAGES = ["/login", "/register", "/verify-otp"];

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("sb_refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedPath && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (refreshToken && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/provider/:path*", "/customer/:path*", "/login", "/register", "/verify-otp"],
};
