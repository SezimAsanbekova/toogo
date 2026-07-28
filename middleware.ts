import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/jwt";
import { TOKEN_COOKIE } from "./app/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value ?? null;
  const session = token ? verifyToken(token) : null;

  // ── Admin auth pages (login / otp) ──
  // If already logged in as admin → redirect to dashboard
  const isAdminAuthPage =
    pathname === "/admin" || pathname === "/admin/otp";

  if (isAdminAuthPage && session?.role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // ── Protected admin pages ──
  const isAdminProtected = pathname.startsWith("/admin/dashboard");

  if (isAdminProtected) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (session.role !== "admin") {
      // Partner trying to access admin area → back to home
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/otp", "/admin/dashboard/:path*"],
};
