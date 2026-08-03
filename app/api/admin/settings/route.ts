import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";

export async function GET() {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(
    Object.fromEntries(settings.map((s) => [s.key, s.value]))
  );
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body: Record<string, string> = await req.json();
  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
