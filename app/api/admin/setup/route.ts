/**
 * POST /api/admin/setup
 * One-time endpoint to create the first admin user + settings.
 * DISABLE THIS IN PRODUCTION after first use.
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "DISABLED_IN_PRODUCTION" }, { status: 403 });
  }

  try {
    const {
      email = "admin@toogo.kg",
      password = "Admin1234!",
      fullName = "TooGo Admin",
      telegramBotToken,
      telegramUserId,
    } = await req.json();

    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "ADMIN_ALREADY_EXISTS", id: String(existing.id) }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        full_name: fullName,
        email,
        password_hash: hash,
        role: "admin",
        status: "active",
      },
    });

    // Upsert Telegram settings
    if (telegramBotToken) {
      await prisma.setting.upsert({
        where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" },
        update: { value: telegramBotToken },
        create: { key: "ADMIN_TELEGRAM_BOT_TOKEN", value: telegramBotToken },
      });
    }

    if (telegramUserId) {
      await prisma.setting.upsert({
        where: { key: "ADMIN_TELEGRAM_USER_ID" },
        update: { value: String(telegramUserId) },
        create: { key: "ADMIN_TELEGRAM_USER_ID", value: String(telegramUserId) },
      });
    }

    return NextResponse.json({
      ok: true,
      admin: { id: String(user.id), email: user.email },
    });
  } catch (err) {
    console.error("Setup error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
