import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requirePartner } from "@/app/lib/auth";
import { notifyAdminNewService, notifyPartner } from "@/app/lib/telegram";

export async function POST(req: NextRequest) {
  let session;
  try { session = await requirePartner(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { title, description, category_id, location_id, price, currency, phone, whatsapp, telegram } = await req.json();

  if (!title || !category_id || !location_id) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const service = await prisma.partnerService.create({
    data: {
      partner_id: BigInt(session.userId),
      title,
      description: description || null,
      category_id: Number(category_id),
      location_id: BigInt(location_id),
      price: price ? Number(price) : null,
      currency: currency || "KGS",
      phone: phone || null,
      whatsapp: whatsapp || null,
      telegram: telegram || null,
      status: "pending",
    },
    include: {
      category: { select: { name: true } },
      location: { select: { name: true } },
    },
  });

  const serviceId = String(service.id);

  // Fire & forget — don't block the response
  void Promise.all([
    notifyAdminNewService(serviceId).catch(console.error),
    notifyPartner(session.userId, service.title, "submitted").catch(console.error),
  ]);

  return NextResponse.json({ id: serviceId, title: service.title, status: service.status });
}
