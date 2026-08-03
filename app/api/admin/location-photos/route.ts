import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET /api/admin/location-photos?location_id=123
export async function GET(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const location_id = searchParams.get("location_id");
  if (!location_id) return NextResponse.json({ error: "MISSING_LOCATION_ID" }, { status: 400 });

  const photos = await prisma.locationPhoto.findMany({
    where: { location_id: BigInt(location_id) },
    orderBy: [{ is_main: "desc" }, { sort_order: "asc" }],
  });

  return NextResponse.json(
    photos.map(p => ({
      id: String(p.id),
      image_url: p.image_url,
      is_main: p.is_main,
      sort_order: p.sort_order,
    }))
  );
}

// POST — add photo by URL or file upload (multipart)
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  // ── File upload (multipart/form-data) ──────────────────────────────────────
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const location_id = formData.get("location_id") as string | null;
    const is_main = formData.get("is_main") === "true";

    if (!file || !location_id) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // Save to public/uploads/locations/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "locations");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const image_url = `/uploads/locations/${filename}`;

    // If is_main, unset existing main
    if (is_main) {
      await prisma.locationPhoto.updateMany({
        where: { location_id: BigInt(location_id) },
        data: { is_main: false },
      });
    }

    const count = await prisma.locationPhoto.count({ where: { location_id: BigInt(location_id) } });

    const photo = await prisma.locationPhoto.create({
      data: {
        location_id: BigInt(location_id),
        image_url,
        is_main: is_main || count === 0,
        sort_order: count,
      },
    });

    return NextResponse.json({ id: String(photo.id), image_url, is_main: photo.is_main });
  }

  // ── URL input (JSON) ────────────────────────────────────────────────────────
  const { location_id, image_url, is_main } = await req.json();
  if (!location_id || !image_url) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  if (is_main) {
    await prisma.locationPhoto.updateMany({
      where: { location_id: BigInt(location_id) },
      data: { is_main: false },
    });
  }

  const count = await prisma.locationPhoto.count({ where: { location_id: BigInt(location_id) } });

  const photo = await prisma.locationPhoto.create({
    data: {
      location_id: BigInt(location_id),
      image_url,
      is_main: is_main || count === 0,
      sort_order: count,
    },
  });

  return NextResponse.json({ id: String(photo.id), image_url, is_main: photo.is_main });
}

// DELETE /api/admin/location-photos  body: { id }
export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const { id } = await req.json();
  await prisma.locationPhoto.delete({ where: { id: BigInt(id) } });
  return NextResponse.json({ ok: true });
}

// PATCH — set as main  body: { id, location_id }
export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const { id, location_id } = await req.json();
  await prisma.locationPhoto.updateMany({
    where: { location_id: BigInt(location_id) },
    data: { is_main: false },
  });
  await prisma.locationPhoto.update({ where: { id: BigInt(id) }, data: { is_main: true } });
  return NextResponse.json({ ok: true });
}
