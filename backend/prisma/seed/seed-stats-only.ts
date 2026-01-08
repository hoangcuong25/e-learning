import { PrismaClient } from "@prisma/client";
import { seedDailyStats } from "./seedDailyStats";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting standalone seed for Daily Stats...");
  await seedDailyStats();
  console.log("🌳 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
