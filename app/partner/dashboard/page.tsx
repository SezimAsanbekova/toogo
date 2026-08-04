import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import PartnerDashboardClient from "./PartnerDashboardClient";

export default async function PartnerDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "partner") {
    redirect("/partner/login");
  }

  const [user, services, categories, locations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: BigInt(session.userId) },
      select: { full_name: true, email: true, phone: true, telegram: true, created_at: true },
    }),
    prisma.partnerService.findMany({
      where: { partner_id: BigInt(session.userId) },
      include: {
        category: { select: { name: true, icon: true } },
        location: { select: { name: true } },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.serviceCategory.findMany({ orderBy: { id: "asc" } }),
    prisma.location.findMany({
      where: { status: "active" },
      include: { region: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!user) redirect("/partner/login");

  return (
    <PartnerDashboardClient
      email={session.email}
      user={{
        full_name: user.full_name,
        email: user.email,
        phone: user.phone ?? "",
        telegram: user.telegram ?? "",
        member_since: user.created_at.toISOString(),
      }}
      initialServices={services.map(s => ({
        id: String(s.id),
        title: s.title,
        status: s.status,
        price: s.price ? Number(s.price) : null,
        currency: s.currency ?? "KGS",
        category: s.category.name,
        categoryIcon: s.category.icon ?? "",
        location: s.location.name,
        reject_reason: s.reject_reason ?? null,
        created_at: s.created_at.toISOString(),
      }))}
      categories={categories.map(c => ({ id: c.id, name: c.name, icon: c.icon ?? "" }))}
      locations={locations.map(l => ({ id: String(l.id), name: l.name, region: l.region.name }))}
    />
  );
}
