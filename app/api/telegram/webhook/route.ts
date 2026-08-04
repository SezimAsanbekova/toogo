import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { notifyPartner, answerCallback, editMessage } from "@/app/lib/telegram";

async function getBotSettings(): Promise<{ botToken: string; adminChatId: string } | null> {
  const [bot, chat] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" } }),
    prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_USER_ID" } }),
  ]);
  if (!bot?.value || !chat?.value) return null;
  return { botToken: bot.value, adminChatId: chat.value };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const settings = await getBotSettings();
  if (!settings) return NextResponse.json({ ok: true });

  // ── Handle callback_query (button press) ──────────────────────────────────
  const cb = body.callback_query;
  if (!cb) return NextResponse.json({ ok: true });

  const { id: callbackId, data, from, message } = cb;
  const chatId = String(from.id);

  // Security: only admin can use buttons
  if (chatId !== settings.adminChatId) {
    await answerCallback(settings.botToken, callbackId, "⛔ У вас нет прав");
    return NextResponse.json({ ok: true });
  }

  const [action, serviceId] = (data as string).split(":");

  // ── detail ─────────────────────────────────────────────────────────────────
  if (action === "detail") {
    const service = await prisma.partnerService.findUnique({
      where: { id: BigInt(serviceId) },
      include: {
        partner: { select: { full_name: true, email: true, phone: true, telegram: true, whatsapp: true } },
        category: { select: { name: true } },
        location: { select: { name: true } },
        photos: { orderBy: [{ is_main: "desc" }, { sort_order: "asc" }], take: 10 },
      },
    });

    if (!service) {
      await answerCallback(settings.botToken, callbackId, "Услуга не найдена");
      return NextResponse.json({ ok: true });
    }

    const statusLabels: Record<string, string> = {
      pending: "⏳ На модерации",
      approved: "✅ Одобрена",
      rejected: "❌ Отклонена",
      deleted: "🗑 Удалена",
    };

    const detail = [
      `📋 <b>Подробная информация</b>`,
      ``,
      `<b>Услуга:</b> ${service.title}`,
      `<b>Статус:</b> ${statusLabels[service.status] ?? service.status}`,
      `<b>Категория:</b> ${service.category.name}`,
      `<b>Локация:</b> ${service.location.name}`,
      service.description ? `<b>Описание:</b> ${service.description}` : null,
      service.price ? `<b>Стоимость:</b> ${service.price} ${service.currency ?? "KGS"}` : null,
      ``,
      `<b>Партнёр:</b> ${service.partner.full_name}`,
      `<b>Email:</b> ${service.partner.email}`,
      service.partner.phone ? `<b>Телефон:</b> ${service.partner.phone}` : null,
      service.partner.whatsapp ? `<b>WhatsApp:</b> ${service.partner.whatsapp}` : null,
      service.partner.telegram ? `<b>Telegram:</b> ${service.partner.telegram}` : null,
      ``,
      `<b>Фото:</b> ${service.photos.length} шт.`,
      `<b>ID:</b> <code>${serviceId}</code>`,
    ].filter(Boolean).join("\n");

    // Send as new message
    await fetch(`https://api.telegram.org/bot${settings.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.adminChatId,
        text: detail,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[
            { text: "✅ Одобрить",  callback_data: `approve:${serviceId}` },
            { text: "❌ Отклонить", callback_data: `reject:${serviceId}` },
          ]],
        },
      }),
    });

    await answerCallback(settings.botToken, callbackId, "ℹ️ Подробная информация");
    return NextResponse.json({ ok: true });
  }

  // ── approve ────────────────────────────────────────────────────────────────
  if (action === "approve") {
    const service = await prisma.partnerService.findUnique({
      where: { id: BigInt(serviceId) },
      include: { partner: { select: { id: true, full_name: true } } },
    });

    if (!service) {
      await answerCallback(settings.botToken, callbackId, "Услуга не найдена");
      return NextResponse.json({ ok: true });
    }
    if (service.status !== "pending") {
      await answerCallback(settings.botToken, callbackId, `Заявка уже ${service.status === "approved" ? "одобрена" : "обработана"}`);
      return NextResponse.json({ ok: true });
    }

    // Get admin user
    const adminUser = await prisma.user.findFirst({ where: { role: "admin" } });

    await prisma.$transaction([
      prisma.partnerService.update({
        where: { id: BigInt(serviceId) },
        data: { status: "approved", approved_at: new Date() },
      }),
      ...(adminUser ? [prisma.moderationHistory.create({
        data: {
          service_id: BigInt(serviceId),
          admin_id: adminUser.id,
          action: "approved",
          comment: "Одобрено через Telegram",
        },
      })] : []),
    ]);

    await answerCallback(settings.botToken, callbackId, "✅ Услуга одобрена!");

    // Edit original message
    if (message?.message_id) {
      await editMessage(
        settings.botToken,
        settings.adminChatId,
        message.message_id,
        `✅ <b>Одобрено</b>\n\nУслуга «${service.title}» опубликована на сайте.\nПартнёр: ${service.partner.full_name}`
      );
    }

    // Notify partner
    await notifyPartner(String(service.partner.id), service.title, "approved");

    return NextResponse.json({ ok: true });
  }

  // ── reject ─────────────────────────────────────────────────────────────────
  if (action === "reject") {
    const service = await prisma.partnerService.findUnique({
      where: { id: BigInt(serviceId) },
      include: { partner: { select: { id: true, full_name: true } } },
    });

    if (!service) {
      await answerCallback(settings.botToken, callbackId, "Услуга не найдена");
      return NextResponse.json({ ok: true });
    }
    if (service.status !== "pending") {
      await answerCallback(settings.botToken, callbackId, "Заявка уже обработана");
      return NextResponse.json({ ok: true });
    }

    // Ask for reason via inline keyboard with common reasons
    await fetch(`https://api.telegram.org/bot${settings.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.adminChatId,
        text: `❌ Укажите причину отклонения услуги «${service.title}»:`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "Неполное описание",       callback_data: `rejectwhy:${serviceId}:Неполное описание` }],
            [{ text: "Некорректная цена",        callback_data: `rejectwhy:${serviceId}:Некорректная цена` }],
            [{ text: "Нарушение правил",         callback_data: `rejectwhy:${serviceId}:Нарушение правил платформы` }],
            [{ text: "Дублирующая услуга",       callback_data: `rejectwhy:${serviceId}:Дублирующая услуга` }],
            [{ text: "Неверные контактные данные", callback_data: `rejectwhy:${serviceId}:Неверные контактные данные` }],
            [{ text: "Отклонить без причины",    callback_data: `rejectwhy:${serviceId}:` }],
          ],
        },
      }),
    });

    await answerCallback(settings.botToken, callbackId, "Выберите причину");
    return NextResponse.json({ ok: true });
  }

  // ── rejectwhy ──────────────────────────────────────────────────────────────
  if (action === "rejectwhy") {
    const parts = (data as string).split(":");
    const svcId = parts[1];
    const reason = parts.slice(2).join(":") || null;

    const service = await prisma.partnerService.findUnique({
      where: { id: BigInt(svcId) },
      include: { partner: { select: { id: true, full_name: true } } },
    });

    if (!service) {
      await answerCallback(settings.botToken, callbackId, "Услуга не найдена");
      return NextResponse.json({ ok: true });
    }

    const adminUser = await prisma.user.findFirst({ where: { role: "admin" } });

    await prisma.$transaction([
      prisma.partnerService.update({
        where: { id: BigInt(svcId) },
        data: { status: "rejected", reject_reason: reason },
      }),
      ...(adminUser ? [prisma.moderationHistory.create({
        data: {
          service_id: BigInt(svcId),
          admin_id: adminUser.id,
          action: "rejected",
          comment: reason ?? "Отклонено через Telegram",
        },
      })] : []),
    ]);

    await answerCallback(settings.botToken, callbackId, "❌ Услуга отклонена");

    if (message?.message_id) {
      await editMessage(
        settings.botToken,
        settings.adminChatId,
        message.message_id,
        `❌ <b>Отклонено</b>\n\nУслуга «${service.title}»\nПартнёр: ${service.partner.full_name}${reason ? `\n📝 Причина: ${reason}` : ""}`
      );
    }

    await notifyPartner(String(service.partner.id), service.title, "rejected", reason ?? undefined);

    return NextResponse.json({ ok: true });
  }

  await answerCallback(settings.botToken, callbackId, "");
  return NextResponse.json({ ok: true });
}
