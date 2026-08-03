import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getSession, requireAdmin } from "@/app/lib/auth";

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

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json();
  const { type } = body;

  // Add new category
  if (type === "category") {
    const { name, icon } = body;
    if (!name) return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    const cat = await prisma.serviceCategory.create({ data: { name, icon: icon || null } });
    return NextResponse.json({ id: cat.id, name: cat.name });
  }

  // Add new service (by admin, auto-approved)
  const { title, description, partner_id, location_id, category_id, price, currency, phone, whatsapp, telegram } = body;
  if (!title || !partner_id || !location_id || !category_id) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const service = await prisma.partnerService.create({
    data: {
      title,
      description: description || null,
      partner_id: BigInt(partner_id),
      location_id: BigInt(location_id),
      category_id: Number(category_id),
      price: price ? Number(price) : null,
      currency: currency || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      telegram: telegram || null,
      status: "approved",
      approved_at: new Date(),
    },
    include: {
      partner: { select: { full_name: true } },
      category: { select: { name: true } },
      location: { select: { name: true } },
    },
  });

  return NextResponse.json({
    id: String(service.id),
    title: service.title,
    partner: service.partner.full_name,
    category: service.category.name,
    location: service.location.name,
  });
}
