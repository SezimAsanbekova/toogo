import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { signToken } from "@/app/lib/jwt";
import { TOKEN_COOKIE } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId: string = String(body.userId ?? "").trim();
    const code: string = String(body.code ?? "").trim();

    if (!userId || !code) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1. Find OTP record in DB
    const otpRecord = await prisma.adminOtp.findUnique({
      where: { user_id: BigInt(userId) },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "OTP_NOT_FOUND" }, { status: 401 });
    }

    // 2. Check expiry
    if (new Date() > otpRecord.expires_at) {
      await prisma.adminOtp.delete({ where: { user_id: BigInt(userId) } });
      return NextResponse.json({ error: "OTP_EXPIRED" }, { status: 401 });
    }

    // 3. Check code
    if (otpRecord.code !== code) {
      return NextResponse.json({ error: "OTP_INVALID" }, { status: 401 });
    }

    // 4. Delete OTP after use
    await prisma.adminOtp.delete({ where: { user_id: BigInt(userId) } });

    // 5. Load user
    const user = await prisma.user.findUnique({ where: { id: BigInt(userId) } });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 403 });
    }

    // 6. Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    // 7. Issue JWT cookie
    const token = signToken({
      userId: String(user.id),
      email: user.email,
      role: "admin",
    });

    const response = NextResponse.json({ ok: true, redirect: "/admin/dashboard" });
    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("OTP verify error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
