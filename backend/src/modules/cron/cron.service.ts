import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "src/core/prisma/prisma.service";
import * as dayjs from "dayjs";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyStats() {
    this.logger.log("Running daily stats cron job...");
    // Run for yesterday
    const yesterday = dayjs().subtract(1, "day").toDate();
    await this.updateCourseDailyStats(yesterday);
    await this.updateInstructorDailyStats(yesterday);
    this.logger.log("Daily stats cron job completed.");
  }

  async updateCourseDailyStats(date: Date = new Date()) {
    const startOfDay = dayjs(date).startOf("day").toDate();
    const endOfDay = dayjs(date).endOf("day").toDate();

    this.logger.log(
      `Updating course daily stats for ${startOfDay.toISOString()}`
    );

    // 1. Get all courses
    const courses = await this.prisma.course.findMany({
      select: { id: true },
    });

    for (const course of courses) {
      // 2. Aggregate Views
      const views = await this.prisma.courseView.count({
        where: {
          courseId: course.id,
          viewedAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      // 3. Aggregate Enrollments
      const enrollments = await this.prisma.enrollment.count({
        where: {
          courseId: course.id,
          enrolledAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      // 4. Aggregate Revenue (from InstructorEarning)
      const earnings = await this.prisma.instructorEarning.aggregate({
        where: {
          courseId: course.id,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        _sum: {
          amount: true,
        },
      });
      const revenue = earnings._sum.amount || 0;

      // 5. Upsert CourseDailyStats
      await this.prisma.courseDailyStats.upsert({
        where: {
          courseId_date: {
            courseId: course.id,
            date: startOfDay,
          },
        },
        update: {
          views,
          enrollments,
          revenue,
        },
        create: {
          courseId: course.id,
          date: startOfDay,
          views,
          enrollments,
          revenue,
        },
      });
    }
  }

  async updateInstructorDailyStats(date: Date = new Date()) {
    const startOfDay = dayjs(date).startOf("day").toDate();

    this.logger.log(
      `Updating instructor daily stats for ${startOfDay.toISOString()}`
    );

    // 1. Get all instructors (users with role INSTRUCTOR)
    const instructors = await this.prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      select: { id: true },
    });

    for (const instructor of instructors) {
      // 2. Get all courses for this instructor
      const instructorCourses = await this.prisma.course.findMany({
        where: { instructorId: instructor.id },
        select: { id: true },
      });

      const courseIds = instructorCourses.map((c) => c.id);

      if (courseIds.length === 0) {
        // Skip instructors with no courses
        continue;
      }

      // 3. Aggregate stats from CourseDailyStats for this instructor's courses
      const stats = await this.prisma.courseDailyStats.aggregate({
        where: {
          courseId: { in: courseIds },
          date: startOfDay,
        },
        _sum: {
          views: true,
          enrollments: true,
          revenue: true,
        },
      });

      const totalViews = stats._sum.views || 0;
      const totalEnrollments = stats._sum.enrollments || 0;
      const totalRevenue = stats._sum.revenue || 0;

      // 4. Upsert InstructorDailyStats
      await this.prisma.instructorDailyStats.upsert({
        where: {
          instructorId_date: {
            instructorId: instructor.id,
            date: startOfDay,
          },
        },
        update: {
          totalViews,
          totalEnrollments,
          totalRevenue,
        },
        create: {
          instructorId: instructor.id,
          date: startOfDay,
          totalViews,
          totalEnrollments,
          totalRevenue,
        },
      });
    }

    this.logger.log(
      `Instructor daily stats updated for ${instructors.length} instructors`
    );
  }
}
