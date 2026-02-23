import { PrismaClient } from "@prisma/client";
import { seedSpecializations } from "./seedSpecializations";
import { seedUsers } from "./seedUsers";
import { seedInstructorApplications } from "./seedInstructorApplications";
import { seedCourses } from "./seedCourses";
import { seedDailyStats } from "./seedDailyStats";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu...");

  await seedUsers();
  await seedSpecializations();
  await seedInstructorApplications();
  await seedCourses();
  await seedDailyStats();

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
