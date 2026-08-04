import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { LOCATIONS } from "../../data/locations";
import LocationDetail from "./LocationDetail";

export const dynamic = "force-dynamic";

export default async function LocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load all service categories from DB (always shown)
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { id: "asc" },
  });

  // ── 1. Try DB first ────────────────────────────────────────────────────────
  let loc = null;

  try {
    const location = await prisma.location.findUnique({
      where: { id: BigInt(id) },
      include: {
        region: { select: { name: true } },
        photos: { orderBy: [{ is_main: "desc" }, { sort_order: "asc" }] },
        services: {
          where: { status: "approved" },
          include: {
            category: { select: { name: true, icon: true } },
            partner: { select: { full_name: true, phone: true, telegram: true } },
          },
          take: 20,
        },
      },
    });

    if (location) {
      loc = {
        id: String(location.id),
        name: location.name,
        region: location.region.name,
        description: location.description ?? "",
        altitude: location.altitude ?? 0,
        distance: location.distance_km ?? 0,
        travelTime: location.travel_time ?? "",
        difficulty: (location.difficulty ?? "easy") as "easy" | "medium" | "hard",
        visitPrice: location.visit_price ? Number(location.visit_price) : 0,
        bestSeason: (location.best_season ?? "all_year") as string,
        recommendations: location.recommendations ?? "",
        isPopular: location.is_popular,
        latitude: location.latitude ? Number(location.latitude) : 0,
        longitude: location.longitude ? Number(location.longitude) : 0,
        image: location.photos[0]?.image_url
          ?? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        images: location.photos.length > 0
          ? location.photos.map((p) => p.image_url)
          : ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"],
        services: location.services.map((s) => ({
          id: String(s.id),
          title: s.title,
          category: s.category.name,
          categoryIcon: s.category.icon ?? "",
          price: s.price ? Number(s.price) : null,
          currency: s.currency ?? "",
          partner: s.partner.full_name,
          phone: s.partner.phone ?? "",
          telegram: s.partner.telegram ?? "",
        })),
      };
    }
  } catch {
    // BigInt parse failed — try static fallback
  }

  // ── 2. Fallback to static LOCATIONS array (legacy ids 1–10) ───────────────
  if (!loc) {
    const staticLoc = LOCATIONS.find((l) => l.id === Number(id));
    if (staticLoc) {
      loc = {
        id: String(staticLoc.id),
        name: staticLoc.name,
        region: staticLoc.region,
        description: staticLoc.description,
        altitude: staticLoc.altitude,
        distance: staticLoc.distance,
        travelTime: staticLoc.travelTime,
        difficulty: staticLoc.difficulty,
        visitPrice: staticLoc.visitPrice,
        bestSeason: staticLoc.bestSeason,
        recommendations: staticLoc.recommendations,
        isPopular: staticLoc.isPopular,
        latitude: staticLoc.latitude,
        longitude: staticLoc.longitude,
        image: staticLoc.images[0] ?? staticLoc.image,
        images: staticLoc.images,
        services: [],
      };
    }
  }

  if (!loc) notFound();

  return (
    <LocationDetail
      loc={loc!}
      allCategories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon ?? "",
      }))}
    />
  );
}
