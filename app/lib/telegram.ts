import { prisma } from "./prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getSettings(): Promise<{ botToken: string; adminChatId: string } | null> {
  const [bot, chat] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" } }),
    prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_USER_ID" } }),
  ]);
  if (!bot?.value || !chat?.value) return null;
  return { botToken: bot.value, adminChatId: chat.value };
}

async function tgApi(botToken: string, method: string, body: object): Promise<unknown> {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Notify admin about new service ───────────────────────────────────────────

export async function notifyAdminNewService(serviceId: string) {
  const settings = await getSettings();
  if (!settings) return;

  const service = await prisma.partnerService.findUnique({
    where: { id: BigInt(serviceId) },
    include: {
      partner: { select: { full_name: true, email: true, phone: true, telegram: true } },
      category: { select: { name: true } },
      location: { select: { name: true } },
      photos: { orderBy: [{ is_main: "desc" }, { sort_order: "asc" }], take: 5 },
    },
  });
  if (!service) return;

  const createdAt = service.created_at.toLocaleDateString("ru-RU", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const text = [
    `🆕 <b>Новая заявка на модерацию</b>`,
    ``,
    `👤 <b>Партнёр:</b> ${escapeHtml(service.partner.full_name)}`,
    `📧 ${escapeHtml(service.partner.email)}`,
    service.partner.phone ? `📞 ${escapeHtml(service.partner.phone)}` : null,
    service.partner.telegram ? `💬 ${escapeHtml(service.partner.telegram)}` : null,
    ``,
    `🏷 <b>Услуга:</b> ${escapeHtml(service.title)}`,
    `📂 <b>Категория:</b> ${escapeHtml(service.category.name)}`,
    `📍 <b>Локация:</b> ${escapeHtml(service.location.name)}`,
    service.description ? `📝 <b>Описание:</b> ${escapeHtml(service.description)}` : null,
    service.price
      ? `💰 <b>Стоимость:</b> ${service.price} ${service.currency ?? "KGS"}`
      : `💰 <b>Стоимость:</b> Не указана`,
    ``,
    `📅 <b>Дата подачи:</b> ${createdAt}`,
    `🆔 ID: <code>${serviceId}</code>`,
  ].filter(Boolean).join("\n");

  const keyboard = {
    inline_keyboard: [[
      { text: "✅ Одобрить",   callback_data: `approve:${serviceId}` },
      { text: "❌ Отклонить",  callback_data: `reject:${serviceId}` },
    ], [
      { text: "👁️ Подробнее",  callback_data: `detail:${serviceId}` },
    ]],
  };

  // Send photos as media group if available
  if (service.photos.length > 0) {
    // Send first photo with caption and keyboard
    if (service.photos.length === 1) {
      await tgApi(settings.botToken, "sendPhoto", {
        chat_id: settings.adminChatId,
        photo: service.photos[0].image_url,
        caption: text,
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    } else {
      // Send media group first
      const media = service.photos.slice(0, 10).map((p, i) => ({
        type: "photo",
        media: p.image_url,
        ...(i === 0 ? { caption: text, parse_mode: "HTML" } : {}),
      }));
      await tgApi(settings.botToken, "sendMediaGroup", {
        chat_id: settings.adminChatId,
        media,
      });
      // Then send keyboard separately
      await tgApi(settings.botToken, "sendMessage", {
        chat_id: settings.adminChatId,
        text: `🔘 Действия по заявке <code>${serviceId}</code>:`,
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }
  } else {
    await tgApi(settings.botToken, "sendMessage", {
      chat_id: settings.adminChatId,
      text,
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  }
}

// ── Notify partner ────────────────────────────────────────────────────────────

export async function notifyPartner(
  partnerId: string,
  serviceTitle: string,
  action: "submitted" | "approved" | "rejected",
  reason?: string
) {
  const settings = await getSettings();
  if (!settings) return;

  const partner = await prisma.user.findUnique({
    where: { id: BigInt(partnerId) },
    select: { telegram: true, full_name: true },
  });

  if (!partner?.telegram) return;

  const tg = partner.telegram.replace("@", "");

  const messages: Record<string, string> = {
    submitted: `📬 <b>Заявка принята!</b>\n\nВаша услуга «${escapeHtml(serviceTitle)}» отправлена на проверку администратору.\n\nМы уведомим вас о результате.`,
    approved:  `✅ <b>Услуга одобрена!</b>\n\nВаша услуга «${escapeHtml(serviceTitle)}» прошла модерацию и теперь опубликована на сайте TooGo.`,
    rejected:  `❌ <b>Услуга отклонена</b>\n\nВаша услуга «${escapeHtml(serviceTitle)}» не прошла модерацию.${reason ? `\n\n📝 <b>Причина:</b> ${escapeHtml(reason)}` : ""}\n\nВы можете исправить и подать заново.`,
  };

  // Try to send by username
  try {
    await tgApi(settings.botToken, "sendMessage", {
      chat_id: `@${tg}`,
      text: messages[action],
      parse_mode: "HTML",
    });
  } catch {
    // If can't find by username — skip silently
  }
}

// ── Answer callback query ─────────────────────────────────────────────────────

export async function answerCallback(botToken: string, callbackQueryId: string, text: string) {
  await tgApi(botToken, "answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false,
  });
}

export async function editMessage(
  botToken: string,
  chatId: string | number,
  messageId: number,
  text: string
) {
  await tgApi(botToken, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
  });
}
