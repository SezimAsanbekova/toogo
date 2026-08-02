import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/jwt";
import { TOKEN_COOKIE } from "./app/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value ?? null;
  const session = token ? verifyToken(token) : null;

  // Already authenticated admin → redirect away from login/otp
  if ((pathname === "/admin" || pathname === "/admin/otp") && session?.role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

// Only protect login/otp pages — dashboard is protected via server component
export const config = {
  matcher: ["/admin", "/admin/otp"],
};
