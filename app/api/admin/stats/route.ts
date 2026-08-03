import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const [locations, partners, activeServices, pendingServices] =
    await Promise.all([
      prisma.location.count({ where: { status: "active" } }),
      prisma.user.count({ where: { role: "partner", status: "active" } }),
      prisma.partnerService.count({ where: { status: "approved" } }),
      prisma.partnerService.count({ where: { status: "pending" } }),
    ]);

  return NextResponse.json({ locations, partners, activeServices, pendingServices });
}
