import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "all";

  // Return regions list for forms
  if (searchParams.get("type") === "regions") {
    const regions = await prisma.region.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(regions);
  }

  const where: Record<string, unknown> = {};
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (status !== "all") where.status = status;

  const locations = await prisma.location.findMany({
    where,
    include: {
      region: { select: { name: true } },
      _count: { select: { services: true } },
    },
    orderBy: { created_at: "desc" },
    take: 100,
  });

  return NextResponse.json(
    locations.map((l) => ({
      id: String(l.id),
      name: l.name,
      region: l.region.name,
      region_id: l.region_id,
      status: l.status,
      difficulty: l.difficulty,
      altitude: l.altitude,
      is_popular: l.is_popular,
      services_count: l._count.services,
      created_at: l.created_at.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name, region, description, altitude, distance_km,
    travel_time, difficulty, visit_price, best_season,
    recommendations, is_popular, status,
  } = body;

  if (!name) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  // Find or create region
  let regionRecord = null;
  if (region) {
    regionRecord = await prisma.region.upsert({
      where: { name: region },
      update: {},
      create: { name: region },
    });
  } else {
    // Use a default "Другой" region if not provided
    regionRecord = await prisma.region.upsert({
      where: { name: "Другой" },
      update: {},
      create: { name: "Другой" },
    });
  }

  const location = await prisma.location.create({
    data: {
      name,
      region_id: regionRecord.id,
      description: description || null,
      altitude: altitude ? Number(altitude) : null,
      distance_km: distance_km ? Number(distance_km) : null,
      travel_time: travel_time || null,
      difficulty: difficulty || null,
      visit_price: visit_price ? Number(visit_price) : null,
      best_season: best_season || null,
      recommendations: recommendations || null,
      is_popular: Boolean(is_popular),
      status: status ?? "active",
    },
    include: { region: { select: { name: true } } },
  });

  return NextResponse.json({
    id: String(location.id),
    name: location.name,
    region: location.region.name,
  });
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id, status } = await req.json();
  await prisma.location.update({
    where: { id: BigInt(id) },
    data: { status },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await req.json();
  await prisma.location.update({
    where: { id: BigInt(id) },
    data: { status: "hidden" },
  });
  return NextResponse.json({ ok: true });
}
