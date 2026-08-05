import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requirePartner } from "@/app/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  let session;
  try { session = await requirePartner(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const service_id = formData.get("service_id") as string;

  if (!files.length || !service_id) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  // Verify service belongs to this partner
  const service = await prisma.partnerService.findUnique({
    where: { id: BigInt(service_id) },
    select: { partner_id: true },
  });
  if (!service || String(service.partner_id) !== session.userId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "services");
  await mkdir(uploadDir, { recursive: true });

  const uploaded: string[] = [];
  const existing = await prisma.servicePhoto.count({ where: { service_id: BigInt(service_id) } });

  for (let i = 0; i < Math.min(files.length, 10 - existing); i++) {
    const file = files[i];
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
    const url = `/uploads/services/${filename}`;
    await prisma.servicePhoto.create({
      data: {
        service_id: BigInt(service_id),
        image_url: url,
        is_main: existing + i === 0,
        sort_order: existing + i,
      },
    });
    uploaded.push(url);
  }

  return NextResponse.json({ ok: true, uploaded });
}
