import { PrismaClient } from "@prisma/client";
import { seedSpecializations } from "./seedSpecializations";
import { seedUsers } from "./seedUsers";
import { seedInstructorApplications } from "./seedInstructorApplications";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu...");

  await seedUsers();
  await seedSpecializations();
  await seedInstructorApplications();

  console.log("🌳 Seed hoàn tất!");
}

main()
  .catch((e) => {
    console.error("❌ Seed thất bại:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
