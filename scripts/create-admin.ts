/**
 * Run: npx tsx scripts/create-admin.ts
 * Creates an admin user in the database.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@toogo.kg";
  const password = process.env.ADMIN_PASSWORD ?? "Admin1234!";
  const fullName = process.env.ADMIN_NAME ?? "TooGo Admin";

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password_hash: hash, role: "admin", status: "active" },
    create: {
      full_name: fullName,
      email,
      password_hash: hash,
      role: "admin",
      status: "active",
    },
  });

  console.log(`✅ Admin created: ${user.email} (id: ${user.id})`);

  // Seed settings if missing
  const settings = [
    { key: "ADMIN_TELEGRAM_BOT_TOKEN", value: "YOUR_BOT_TOKEN_HERE" },
    { key: "ADMIN_TELEGRAM_USER_ID",   value: "YOUR_TELEGRAM_USER_ID" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value },
    });
    console.log(`✅ Setting: ${s.key}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
