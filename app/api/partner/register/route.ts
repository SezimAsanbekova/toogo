import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { signToken } from "@/app/lib/jwt";
import { TOKEN_COOKIE } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const full_name: string = (body.full_name ?? "").trim();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const password: string = body.password ?? "";
    const phone: string = (body.phone ?? "").trim();
    const whatsapp: string = (body.whatsapp ?? "").trim();
    const telegram: string = (body.telegram ?? "").trim();
    const business_type_id: number | null = body.business_type_id ? Number(body.business_type_id) : null;

    if (!full_name || !email || !password) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "PASSWORD_TOO_SHORT" }, { status: 400 });
    }

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "EMAIL_EXISTS" }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        full_name,
        email,
        password_hash,
        phone: phone || null,
        whatsapp: whatsapp || null,
        telegram: telegram || null,
        role: "partner",
        status: "active",
        business_type_id: business_type_id || null,
      },
    });

    const token = signToken({
      userId: String(user.id),
      email: user.email,
      role: "partner",
    });

    // Redirect to login after registration
    const response = NextResponse.json({ ok: true, redirect: "/partner/login" });
    // Do NOT set cookie here — user must log in manually
    return response;
  } catch (err: unknown) {
    console.error("Partner register error:", err);

    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("phone")) {
      return NextResponse.json({ error: "PHONE_EXISTS" }, { status: 409 });
    }
    if (msg.includes("email")) {
      return NextResponse.json({ error: "EMAIL_EXISTS" }, { status: 409 });
    }

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
