import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requirePartner } from "@/app/lib/auth";

export async function GET() {
  let session;
  try { session = await requirePartner(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const [user, services] = await Promise.all([
    prisma.user.findUnique({
      where: { id: BigInt(session.userId) },
      select: { id: true, full_name: true, email: true, phone: true, telegram: true, whatsapp: true, created_at: true },
    }),
    prisma.partnerService.findMany({
      where: { partner_id: BigInt(session.userId) },
      include: {
        category: { select: { name: true, icon: true } },
        location: { select: { name: true } },
      },
      orderBy: { created_at: "desc" },
    }),
  ]);

  if (!user) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const counts = {
    total: services.length,
    pending: services.filter(s => s.status === "pending").length,
    approved: services.filter(s => s.status === "approved").length,
    rejected: services.filter(s => s.status === "rejected").length,
  };

  return NextResponse.json({
    user: {
      id: String(user.id),
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      telegram: user.telegram,
      whatsapp: user.whatsapp,
      member_since: user.created_at.toISOString(),
    },
    counts,
    services: services.map(s => ({
      id: String(s.id),
      title: s.title,
      status: s.status,
      price: s.price ? Number(s.price) : null,
      currency: s.currency ?? "KGS",
      category: s.category.name,
      categoryIcon: s.category.icon ?? "",
      location: s.location.name,
      reject_reason: s.reject_reason,
      created_at: s.created_at.toISOString(),
    })),
  });
}
