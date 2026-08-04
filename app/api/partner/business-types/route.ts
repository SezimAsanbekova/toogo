import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const types = await prisma.businessType.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(types);
}
