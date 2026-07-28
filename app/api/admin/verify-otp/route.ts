import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { signToken } from "@/app/lib/jwt";
import otpStore from "@/app/lib/otpStore";
import { TOKEN_COOKIE } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1. Check OTP
    const entry = otpStore.get(String(userId));
    if (!entry) {
      return NextResponse.json({ error: "OTP_NOT_FOUND" }, { status: 401 });
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(String(userId));
      return NextResponse.json({ error: "OTP_EXPIRED" }, { status: 401 });
    }

    if (entry.code !== code) {
      return NextResponse.json({ error: "OTP_INVALID" }, { status: 401 });
    }

    // 2. Clean up
    otpStore.delete(String(userId));

    // 3. Load user
    const user = await prisma.user.findUnique({ where: { id: BigInt(userId) } });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 403 });
    }

    // 4. Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    // 5. Issue JWT
    const token = signToken({
      userId: String(user.id),
      email: user.email,
      role: "admin",
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("OTP verify error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
