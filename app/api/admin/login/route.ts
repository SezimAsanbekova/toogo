import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const password: string = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1. Find admin user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }
    if (user.status === "blocked") {
      return NextResponse.json({ error: "BLOCKED" }, { status: 403 });
    }
    if (!user.password_hash) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    // 2. Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    // 3. Get Telegram settings
    const [botSetting, chatSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" } }),
      prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_USER_ID" } }),
    ]);

    if (!botSetting?.value || !chatSetting?.value) {
      return NextResponse.json({ error: "TELEGRAM_NOT_CONFIGURED" }, { status: 500 });
    }

    // 4. Generate OTP and save to DB (upsert — one record per user)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.adminOtp.upsert({
      where: { user_id: user.id },
      update: { code, expires_at: expiresAt },
      create: { user_id: user.id, code, expires_at: expiresAt },
    });

    // 5. Send via Telegram
    const message = `🔐 *TooGo Admin*\n\nКод подтверждения: \`${code}\`\n\n_Действителен 10 минут._`;

    const tgRes = await fetch(
      `https://api.telegram.org/bot${botSetting.value}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatSetting.value,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!tgRes.ok) {
      console.error("Telegram error:", await tgRes.text());
      return NextResponse.json({ error: "TELEGRAM_SEND_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ userId: String(user.id) });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
