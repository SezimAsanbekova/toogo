import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import otpStore from "@/app/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1. Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    if (user.status === "blocked") {
      return NextResponse.json({ error: "BLOCKED" }, { status: 403 });
    }

    // 2. Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    // 3. Get Telegram settings
    const [botTokenSetting, chatIdSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" } }),
      prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_USER_ID" } }),
    ]);

    if (!botTokenSetting || !chatIdSetting) {
      return NextResponse.json({ error: "TELEGRAM_NOT_CONFIGURED" }, { status: 500 });
    }

    // 4. Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min

    otpStore.set(String(user.id), { code, expiresAt });

    // 5. Send via Telegram Bot API
    const message = `🔐 TooGo Admin\n\nКод подтверждения: *${code}*\n\nДействителен 10 минут.`;
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botTokenSetting.value}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatIdSetting.value,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramRes.ok) {
      console.error("Telegram error:", await telegramRes.text());
      return NextResponse.json({ error: "TELEGRAM_SEND_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ userId: String(user.id) });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
