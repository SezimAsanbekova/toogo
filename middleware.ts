import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_COOKIE = "toogo_token";

async function getRole(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await getRole(req);

  // ── Admin ──────────────────────────────────────────────────────────────────
  if ((pathname === "/admin" || pathname === "/admin/otp") && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // ── Partner auth pages → redirect to dashboard if already logged in ────────
  if (
    (pathname === "/partner" ||
      pathname === "/partner/login" ||
      pathname === "/partner/register") &&
    role === "partner"
  ) {
    return NextResponse.redirect(new URL("/partner/dashboard", req.url));
  }

  // ── Partner dashboard → redirect to login if not logged in ────────────────
  if (pathname.startsWith("/partner/dashboard") && role !== "partner") {
    return NextResponse.redirect(new URL("/partner/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/otp",
    "/partner",
    "/partner/login",
    "/partner/register",
    "/partner/dashboard/:path*",
  ],
};
