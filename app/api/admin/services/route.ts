import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "all";

  // Categories with service count
  const categories = await prisma.serviceCategory.findMany({
    include: { _count: { select: { services: true } } },
    orderBy: { id: "asc" },
  });

  // Services (listings)
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status !== "all") {
    where.status = status;
  }

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

  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      count: c._count.services,
    })),
    services: services.map((s) => ({
      id: String(s.id),
      title: s.title,
      status: s.status,
      price: s.price ? Number(s.price) : null,
      currency: s.currency,
      category: s.category.name,
      location: s.location.name,
      partner: s.partner.full_name,
      createdAt: s.created_at.toISOString(),
    })),
  });
}
