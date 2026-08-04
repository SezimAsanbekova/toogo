import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category");

  const where: Record<string, unknown> = {
    location_id: BigInt(id),
    status: "approved",
  };
  if (categoryId) where.category_id = Number(categoryId);

  const services = await prisma.partnerService.findMany({
    where,
    include: {
      category: { select: { name: true, icon: true } },
      partner: { select: { full_name: true, phone: true, whatsapp: true, telegram: true } },
    },
    orderBy: { approved_at: "desc" },
  });

  return NextResponse.json(
    services.map((s) => ({
      id: String(s.id),
      title: s.title,
      description: s.description ?? "",
      price: s.price ? Number(s.price) : null,
      currency: s.currency ?? "KGS",
      phone: s.phone ?? s.partner.phone ?? "",
      whatsapp: s.whatsapp ?? s.partner.whatsapp ?? "",
      telegram: s.telegram ?? s.partner.telegram ?? "",
      category: s.category.name,
      categoryIcon: s.category.icon ?? "",
      partner: s.partner.full_name,
    }))
  );
}
