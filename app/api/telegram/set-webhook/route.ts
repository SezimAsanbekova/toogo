import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { siteUrl } = await req.json();
  const webhookUrl = `${siteUrl}/api/telegram/webhook`;

  const bot = await prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" } });
  if (!bot?.value) {
    return NextResponse.json({ error: "BOT_TOKEN_NOT_SET" }, { status: 400 });
  }

  const res = await fetch(`https://api.telegram.org/bot${bot.value}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl }),
  });

  const data = await res.json();
  return NextResponse.json({ ok: data.ok, description: data.description, webhookUrl });
}

export async function DELETE(_req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const bot = await prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" } });
  if (!bot?.value) return NextResponse.json({ error: "BOT_TOKEN_NOT_SET" }, { status: 400 });

  const res = await fetch(`https://api.telegram.org/bot${bot.value}/deleteWebhook`, { method: "POST" });
  const data = await res.json();
  return NextResponse.json({ ok: data.ok });
}
