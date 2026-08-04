import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import ServicesPage from "./ServicesPage";

export const dynamic = "force-dynamic";

export default async function LocationServicesPage({
  params,
}: {
  params: Promise<{ id: string; categoryId: string }>;
}) {
  const { id, categoryId } = await params;

  const [location, category, services] = await Promise.all([
    prisma.location.findUnique({
      where: { id: BigInt(id) },
      select: { id: true, name: true },
    }),
    prisma.serviceCategory.findUnique({
      where: { id: Number(categoryId) },
    }),
    prisma.partnerService.findMany({
      where: {
        location_id: BigInt(id),
        category_id: Number(categoryId),
        status: "approved",
      },
      include: {
        category: { select: { name: true, icon: true } },
        partner: {
          select: { full_name: true, phone: true, whatsapp: true, telegram: true },
        },
      },
      orderBy: { approved_at: "desc" },
    }),
  ]);

  if (!location || !category) notFound();

  return (
    <ServicesPage
      locationId={id}
      locationName={location.name}
      category={{ id: category.id, name: category.name, icon: category.icon ?? "" }}
      services={services.map((s) => ({
        id: String(s.id),
        title: s.title,
        description: s.description ?? "",
        price: s.price ? Number(s.price) : null,
        currency: s.currency ?? "KGS",
        phone: s.phone ?? s.partner.phone ?? "",
        whatsapp: s.whatsapp ?? s.partner.whatsapp ?? "",
        telegram: s.telegram ?? s.partner.telegram ?? "",
        partner: s.partner.full_name,
      }))}
    />
  );
}
