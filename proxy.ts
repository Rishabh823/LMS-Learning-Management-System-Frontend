import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // `getAuthToken`/`setAuthToken` in utils/cookieManager.ts both read/write
  // the "token" cookie, so this must match that key exactly.
  const token = request.cookies.get("token")?.value;

  const isHomeLanding = pathname === "/";
  const isPricing = pathname.startsWith("/pricing");
  const isAuthRoute = pathname.startsWith("/auth");
  const isPublicRoute = isHomeLanding || isPricing || isAuthRoute;

  // Already logged in: skip the marketing landing page and the login/register
  // flow, go straight to the dashboard. Pricing stays visible either way —
  // it's just informational, not a signed-out-only page.
  if (token && (isHomeLanding || isAuthRoute)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Not logged in: any route other than the landing page, pricing, or the
  // auth flow is protected and requires a login redirect.
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|static|api).*)", // everything except static/api
  ],
};
