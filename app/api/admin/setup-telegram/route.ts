/**
 * POST /api/admin/setup-telegram
 * Updates Telegram settings only. Dev only.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "DISABLED" }, { status: 403 });
  }

  const { telegramBotToken, telegramUserId } = await req.json();

  await prisma.setting.upsert({
    where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" },
    update: { value: telegramBotToken },
    create: { key: "ADMIN_TELEGRAM_BOT_TOKEN", value: telegramBotToken },
  });

  await prisma.setting.upsert({
    where: { key: "ADMIN_TELEGRAM_USER_ID" },
    update: { value: String(telegramUserId) },
    create: { key: "ADMIN_TELEGRAM_USER_ID", value: String(telegramUserId) },
  });

  return NextResponse.json({ ok: true });
}
