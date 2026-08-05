import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { createNotification } from "@/app/lib/notifications";

export async function GET(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "pending";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status !== "all") where.status = status;

  const services = await prisma.partnerService.findMany({
    where,
    include: {
      partner: { select: { full_name: true, email: true } },
      category: { select: { name: true } },
      location: { select: { name: true } },
    },
    orderBy: { created_at: "desc" },
    take: 50,
  });

  return NextResponse.json(
    services.map((s) => ({
      id: String(s.id),
      title: s.title,
      description: s.description,
      status: s.status,
      price: s.price ? Number(s.price) : null,
      currency: s.currency,
      category: s.category.name,
      location: s.location.name,
      partner: s.partner.full_name,
      partner_email: s.partner.email,
      reject_reason: s.reject_reason,
      created_at: s.created_at.toISOString(),
    }))
  );
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id, action, comment } = await req.json();
  const session = await import("@/app/lib/auth").then(m => m.getSession());

  const statusMap: Record<string, string> = {
    approve: "approved",
    reject: "rejected",
    delete: "deleted",
  };
  const newStatus = statusMap[action];
  if (!newStatus) return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });

  // Get service + partner info before update
  const service = await prisma.partnerService.findUnique({
    where: { id: BigInt(id) },
    include: { partner: { select: { id: true, full_name: true } } },
  });
  if (!service) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  await prisma.$transaction([
    prisma.partnerService.update({
      where: { id: BigInt(id) },
      data: {
        status: newStatus as "approved" | "rejected" | "deleted",
        reject_reason: action === "reject" ? (comment ?? null) : null,
        approved_at: action === "approve" ? new Date() : null,
      },
    }),
    prisma.moderationHistory.create({
      data: {
        service_id: BigInt(id),
        admin_id: BigInt(session!.id),
        action: action === "approve" ? "approved" : action === "reject" ? "rejected" : "deleted",
        comment: comment ?? null,
      },
    }),
  ]);

  // Send in-app notification to partner
  const partnerId = String(service.partner.id);

  if (action === "approve") {
    await createNotification(
      partnerId,
      "✅ Услуга одобрена",
      `Ваша услуга «${service.title}» прошла модерацию и теперь опубликована на сайте TooGo.`
    );
  } else if (action === "reject") {
    await createNotification(
      partnerId,
      "❌ Услуга отклонена",
      `Ваша услуга «${service.title}» не прошла модерацию.${comment ? ` Причина: ${comment}` : ""}`
    );
  }

  return NextResponse.json({ ok: true });
}
