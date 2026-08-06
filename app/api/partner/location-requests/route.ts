import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requirePartner } from "@/app/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  let session;
  try { session = await requirePartner(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  let fields: Record<string, string> = {};
  let photos: File[] = [];

  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    for (const [k, v] of fd.entries()) {
      if (typeof v === "string") fields[k] = v;
      else photos.push(v as File);
    }
  } else {
    fields = await req.json();
  }

  const { name, region, description, altitude, distance_km, travel_time, difficulty, visit_price, best_season, recommendations } = fields;

  if (!name || !region) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const request = await prisma.locationRequest.create({
    data: {
      partner_id: BigInt(session.userId),
      name,
      region,
      description: description || null,
      altitude: altitude ? Number(altitude) : null,
      distance_km: distance_km ? Number(distance_km) : null,
      travel_time: travel_time || null,
      difficulty: difficulty || null,
      visit_price: visit_price ? Number(visit_price) : null,
      best_season: best_season || null,
      recommendations: recommendations || null,
      status: "pending",
    },
    include: { partner: { select: { full_name: true, email: true } } },
  });

  // Save photos
  if (photos.length > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "location-requests");
    await mkdir(uploadDir, { recursive: true });
    for (const file of photos.slice(0, 10)) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
      await prisma.locationRequestPhoto.create({
        data: { request_id: request.id, image_url: `/uploads/location-requests/${filename}` },
      });
    }
  }

  void notifyAdmin(String(request.id), request.partner.full_name, name, region, description, photos.length).catch(console.error);

  return NextResponse.json({ id: String(request.id), ok: true });
}

async function notifyAdmin(id: string, partnerName: string, name: string, region: string, description?: string | null, photoCount = 0) {
  const [bot, chat] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" } }),
    prisma.setting.findUnique({ where: { key: "ADMIN_TELEGRAM_USER_ID" } }),
  ]);
  if (!bot?.value || !chat?.value) return;

  const text = [
    `📍 <b>Новая заявка на локацию</b>`,
    ``,
    `👤 <b>Партнёр:</b> ${partnerName}`,
    `🏔 <b>Название:</b> ${name}`,
    `📌 <b>Регион:</b> ${region}`,
    description ? `📝 <b>Описание:</b> ${description}` : null,
    photoCount > 0 ? `📸 <b>Фото:</b> ${photoCount} шт.` : null,
    ``,
    `🆔 ID: <code>${id}</code>`,
    `Рассмотрите заявку в панели администратора.`,
  ].filter(Boolean).join("\n");

  await fetch(`https://api.telegram.org/bot${bot.value}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat.value, text, parse_mode: "HTML" }),
  });
}
