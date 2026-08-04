import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const TYPES = [
  { name: "Таксист",           icon: "🚖" },
  { name: "Владелец домика",   icon: "🏡" },
  { name: "Гид",               icon: "🐎" },
  { name: "Кафе",              icon: "☕" },
  { name: "Глэмпинг",         icon: "🏕️" },
  { name: "Юрта",              icon: "⛺" },
  { name: "Аренда снаряжения", icon: "🎒" },
  { name: "Фотограф",          icon: "📸" },
];

export async function POST() {
  for (const t of TYPES) {
    await prisma.businessType.upsert({
      where: { name: t.name },
      update: { icon: t.icon },
      create: t,
    });
  }
  return NextResponse.json({ ok: true, count: TYPES.length });
}
