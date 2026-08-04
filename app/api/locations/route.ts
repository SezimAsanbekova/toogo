import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const difficulty = searchParams.get("difficulty") ?? "";
  const maxDist = Number(searchParams.get("maxDist") ?? 9999);

  const where: Record<string, unknown> = { status: "active" };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { region: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  if (difficulty && difficulty !== "all") where.difficulty = difficulty;
  if (maxDist < 9999) where.distance_km = { lte: maxDist };

  const locations = await prisma.location.findMany({
    where,
    include: {
      region: { select: { name: true } },
      photos: {
        orderBy: [{ is_main: "desc" }, { sort_order: "asc" }],
        take: 5,
      },
    },
    orderBy: [{ is_popular: "desc" }, { created_at: "desc" }],
  });

  return NextResponse.json(
    locations.map((l) => ({
      id: String(l.id),
      name: l.name,
      region: l.region.name,
      description: l.description ?? "",
      altitude: l.altitude ?? 0,
      distance: l.distance_km ?? 0,
      travelTime: l.travel_time ?? "",
      difficulty: l.difficulty ?? "easy",
      visitPrice: l.visit_price ? Number(l.visit_price) : 0,
      bestSeason: l.best_season ?? "all_year",
      recommendations: l.recommendations ?? "",
      isPopular: l.is_popular,
      latitude: l.latitude ? Number(l.latitude) : 0,
      longitude: l.longitude ? Number(l.longitude) : 0,
      image: l.photos[0]?.image_url ?? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      images: l.photos.length > 0
        ? l.photos.map((p) => p.image_url)
        : ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"],
    }))
  );
}
