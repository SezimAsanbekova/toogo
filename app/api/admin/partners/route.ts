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

  const where: Record<string, unknown> = { role: "partner" };
  if (search) {
    where.OR = [
      { full_name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status !== "all") where.status = status;

  const partners = await prisma.user.findMany({
    where,
    include: { _count: { select: { services: true } } },
    orderBy: { created_at: "desc" },
    take: 100,
  });

  return NextResponse.json(
    partners.map((p) => ({
      id: String(p.id),
      full_name: p.full_name,
      email: p.email,
      phone: p.phone,
      telegram: p.telegram,
      status: p.status,
      services_count: p._count.services,
      created_at: p.created_at.toISOString(),
      last_login: p.last_login?.toISOString() ?? null,
    }))
  );
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { full_name, email, password, phone, whatsapp, telegram } = await req.json();
  if (!full_name || !email || !password) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "EMAIL_EXISTS" }, { status: 409 });
  }

  const bcrypt = await import("bcryptjs");
  const password_hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      full_name,
      email,
      password_hash,
      phone: phone || null,
      whatsapp: whatsapp || null,
      telegram: telegram || null,
      role: "partner",
      status: "active",
    },
  });

  return NextResponse.json({ id: String(user.id), full_name: user.full_name, email: user.email });
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const { id, status } = await req.json();
  const user = await prisma.user.update({
    where: { id: BigInt(id) },
    data: { status },
  });
  return NextResponse.json({ ok: true, id: String(user.id), status: user.status });
}
