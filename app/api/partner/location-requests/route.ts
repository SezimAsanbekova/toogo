import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requirePartner } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  let session;
  try { session = await requirePartner(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { name, region, description } = await req.json();
  if (!name || !region) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const request = await prisma.locationRequest.create({
    data: {
      partner_id: BigInt(session.userId),
      name,
      region,
      description: description || null,
      status: "pending",
    },
    include: { partner: { select: { full_name: true, email: true } } },
  });

  // Telegram notification to admin
  void notifyAdminLocationRequest(String(request.id), request.partner.full_name, name, region, description).catch(console.error);

  return NextResponse.json({ id: String(request.id), ok: true });
}

async function notifyAdminLocationRequest(id: string, partnerName: string, name: string, region: string, description?: string | null) {
  const [bot, chat] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" } }),
    prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_USER_ID" } }),
  ]);
  if (!bot?.value || !chat?.value) return;

  const text = [
    `📍 <b>Заявка на новую локацию</b>`,
    ``,
    `👤 <b>Партнёр:</b> ${partnerName}`,
    `🏔 <b>Название:</b> ${name}`,
    `📌 <b>Регион:</b> ${region}`,
    description ? `📝 <b>Описание:</b> ${description}` : null,
    ``,
    `🆔 ID заявки: <code>${id}</code>`,
    ``,
    `Рассмотрите заявку в панели администратора.`,
  ].filter(Boolean).join("\n");

  await fetch(`https://api.telegram.org/bot${bot.value}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat.value, text, parse_mode: "HTML" }),
  });
}
