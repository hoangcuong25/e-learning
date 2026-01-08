import { PrismaClient, TransactionType } from "@prisma/client";
import * as dayjs from "dayjs";

const prisma = new PrismaClient();

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export async function seedDailyStats() {
  console.log("🌱 Seeding Daily Stats...");

  // 1. Get all courses and instructors
  const courses = await prisma.course.findMany();
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
  });

  if (courses.length === 0) {
    console.log("⚠️ No courses found. Skipping daily stats seed.");
    return;
  }

  // 2. Define date range (last 30 days)
  const endDate = dayjs();
  const startDate = endDate.subtract(30, "day");

  // 3. Loop through each day
  for (
    let date = startDate;
    date.isBefore(endDate) || date.isSame(endDate, "day");
    date = date.add(1, "day")
  ) {
    const dateStr = date.format("YYYY-MM-DD");
    const dateForDb = new Date(dateStr); // UTC midnight

    console.log(`   Processing stats for ${dateStr}...`);

    // Track instructor aggregates for this day
    const instructorStatsMap = new Map<
      number,
      { views: number; enrollments: number; revenue: number }
    >();

    // Initialize map for all instructors
    instructors.forEach((inst) => {
      instructorStatsMap.set(inst.id, { views: 0, enrollments: 0, revenue: 0 });
    });

    // 4. Generate stats for each course
    for (const course of courses) {
      // Random stats
      const views = getRandomInt(0, 100);
      const enrollments = getRandomInt(0, 5);
      // Revenue depends on course price. If free, revenue is 0.
      // If paid, revenue = price * enrollments (simplified)
      let revenue = 0;

      // Calculate revenue and create InstructorEarning if paid course
      if (course.type === "PAID" && enrollments > 0) {
        // Instructor gets 80%
        const earningPerEnrollment = course.price * 0.8;
        revenue = earningPerEnrollment * enrollments;

        // Create InstructorEarning records for each enrollment
        for (let i = 0; i < enrollments; i++) {
          await prisma.instructorEarning.create({
            data: {
              instructorId: course.instructorId,
              courseId: course.id,
              amount: earningPerEnrollment,
              type: TransactionType.COURSE_PURCHASE,
              createdAt: dateForDb, // Set creation time to this date
            },
          });
        }
      }

      // Upsert CourseDailyStats
      await prisma.courseDailyStats.upsert({
        where: {
          courseId_date: {
            courseId: course.id,
            date: dateForDb,
          },
        },
        update: {
          views,
          enrollments,
          revenue,
        },
        create: {
          courseId: course.id,
          date: dateForDb,
          views,
          enrollments,
          revenue,
        },
      });

      // Aggregate for instructor
      const currentInstStats = instructorStatsMap.get(course.instructorId);
      if (currentInstStats) {
        currentInstStats.views += views;
        currentInstStats.enrollments += enrollments;
        currentInstStats.revenue += revenue;
      }
    }

    // 5. Upsert InstructorDailyStats
    for (const instructor of instructors) {
      const stats = instructorStatsMap.get(instructor.id);
      if (!stats) continue;

      await prisma.instructorDailyStats.upsert({
        where: {
          instructorId_date: {
            instructorId: instructor.id,
            date: dateForDb,
          },
        },
        update: {
          totalViews: stats.views,
          totalEnrollments: stats.enrollments,
          totalRevenue: stats.revenue,
        },
        create: {
          instructorId: instructor.id,
          date: dateForDb,
          totalViews: stats.views,
          totalEnrollments: stats.enrollments,
          totalRevenue: stats.revenue,
        },
      });
    }
  }

  console.log("✅ Daily Stats Seeded Successfully!");
}
