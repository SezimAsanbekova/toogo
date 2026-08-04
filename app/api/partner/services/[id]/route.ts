import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requirePartner } from "@/app/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let session;
  try { session = await requirePartner(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;

  // Make sure this service belongs to this partner
  const service = await prisma.partnerService.findUnique({
    where: { id: BigInt(id) },
    select: { partner_id: true, status: true },
  });

  if (!service) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  if (String(service.partner_id) !== session.userId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  // Soft delete — set status to "deleted"
  await prisma.partnerService.update({
    where: { id: BigInt(id) },
    data: { status: "deleted" },
  });

  return NextResponse.json({ ok: true });
}
