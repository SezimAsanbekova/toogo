import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requirePartner } from "@/app/lib/auth";

// GET — list notifications
export async function GET() {
  let session;
  try { session = await requirePartner(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { user_id: BigInt(session.userId) },
    orderBy: { created_at: "desc" },
    take: 50,
  });

  return NextResponse.json(
    notifications.map(n => ({
      id: String(n.id),
      title: n.title,
      message: n.message,
      is_read: n.is_read,
      created_at: n.created_at.toISOString(),
    }))
  );
}

// PATCH — mark all as read
export async function PATCH() {
  let session;
  try { session = await requirePartner(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  await prisma.notification.updateMany({
    where: { user_id: BigInt(session.userId), is_read: false },
    data: { is_read: true },
  });

  return NextResponse.json({ ok: true });
}
