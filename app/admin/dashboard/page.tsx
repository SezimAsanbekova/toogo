import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin");
  }

  const [locations, partners, activeServices, pendingServices] =
    await Promise.all([
      prisma.location.count({ where: { status: "active" } }),
      prisma.user.count({ where: { role: "partner", status: "active" } }),
      prisma.partnerService.count({ where: { status: "approved" } }),
      prisma.partnerService.count({ where: { status: "pending" } }),
    ]);

  return (
    <AdminDashboardClient
      email={session.email}
      stats={{ locations, partners, activeServices, pendingServices }}
    />
  );
}
