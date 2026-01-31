import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "./app/(backend)/libs/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdmin = await requireAdmin(request);

  if (isAdmin && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAdmin && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
