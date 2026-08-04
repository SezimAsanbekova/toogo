/**
 * POST /api/partner/reset-password
 * Dev only — resets partner password.
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "DISABLED" }, { status: 403 });
  }

  const { email, newPassword } = await req.json();
  const hash = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { email },
    data: { password_hash: hash },
  });

  return NextResponse.json({ ok: true, email: user.email });
}
