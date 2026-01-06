import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  buildOrderBy,
  buildPaginationParams,
  buildPaginationResponse,
  buildSearchFilter,
} from "src/core/helpers/pagination.util";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class InstructorAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get overview statistics for instructor
   * Returns total revenue, enrollments, views, and number of courses
   */
  async getOverview(instructorId: number) {
    const [totalCourses, stats, earnings] = await Promise.all([
      this.prisma.course.count({
        where: { instructorId },
      }),

      this.prisma.instructorDailyStats.aggregate({
        where: { instructorId },
        _sum: {
          totalRevenue: true,
          totalEnrollments: true,
          totalViews: true,
        },
      }),

      this.prisma.instructorEarning.aggregate({
        where: { instructorId },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalCourses,
      totalRevenue: stats._sum.totalRevenue || 0,
      totalEnrollments: stats._sum.totalEnrollments || 0,
      totalViews: stats._sum.totalViews || 0,
      totalEarnings: earnings._sum.amount || 0,
    };
  }

  /**
   * Get daily statistics with optional date range filtering
   */
  async getDailyStats(instructorId: number, startDate?: Date, endDate?: Date) {
    const where: any = { instructorId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const dailyStats = await this.prisma.instructorDailyStats.findMany({
      where,
      orderBy: { date: "desc" },
      select: {
        date: true,
        totalViews: true,
        totalEnrollments: true,
        totalRevenue: true,
      },
    });

    return dailyStats;
  }

  /**
   * Get analytics for all courses owned by instructor
   */
  async getCourseAnalytics(instructorId: number) {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        viewCount: true,
        averageRating: true,
        totalRating: true,
        price: true,
        type: true,
        isPublished: true,
        createdAt: true,
        courseDailyStats: {
          select: {
            views: true,
            enrollments: true,
            revenue: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    // Calculate aggregated stats for each course
    return courses.map((course) => {
      const totalViews = course.courseDailyStats.reduce(
        (sum, stat) => sum + stat.views,
        0
      );
      const totalEnrollments = course.courseDailyStats.reduce(
        (sum, stat) => sum + stat.enrollments,
        0
      );
      const totalRevenue = course.courseDailyStats.reduce(
        (sum, stat) => sum + stat.revenue,
        0
      );

      return {
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        viewCount: course.viewCount,
        averageRating: course.averageRating,
        totalRating: course.totalRating,
        price: course.price,
        type: course.type,
        isPublished: course.isPublished,
        createdAt: course.createdAt,
        enrollmentCount: course._count.enrollments,
        analytics: {
          totalViews,
          totalEnrollments,
          totalRevenue,
        },
      };
    });
  }

  /**
   * Get paginated earnings history
   */
  async getEarningsHistory(instructorId: number, dto: any) {
    // Build pagination
    const { skip, take, page, limit } = buildPaginationParams(dto);

    // Build sort
    const orderBy = buildOrderBy(dto);

    // Build search 
    const searchFilter = buildSearchFilter<Prisma.InstructorEarningWhereInput>(
      dto,
      ["type"] 
    );

    const where: Prisma.InstructorEarningWhereInput = {
      instructorId,
      ...(searchFilter ? searchFilter : {}),
    };

    const [earnings, total] = await Promise.all([
      this.prisma.instructorEarning.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          courseId: true,
          amount: true,
          type: true,
          createdAt: true,
          transaction: {
            select: {
              id: true,
              note: true,
            },
          },
        },
      }),

      this.prisma.instructorEarning.count({ where }),
    ]);

    return buildPaginationResponse(earnings, total, page, limit);
  }

  async getEnrollmentStats(instructorId: number) {
    const instructorCourses = await this.prisma.course.findMany({
      where: { instructorId },
      select: { id: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);

    if (courseIds.length === 0) {
      return {
        totalStudents: 0,
        totalEnrollments: 0,
        averageProgress: 0,
        completedEnrollmentsCount: 0,
      };
    }

    const [enrollmentStats, uniqueStudents, completedCount] = await Promise.all(
      [
        // 1. Tính tổng số Enrollment và tổng Progress (để tính trung bình)
        this.prisma.enrollment.aggregate({
          where: { courseId: { in: courseIds } },
          _sum: {
            progress: true,
          },
          _count: {
            id: true,
          },
        }),

        // 2. Tính số lượng Học viên duy nhất (Total Students)
        this.prisma.enrollment.groupBy({
          by: ["userId"],
          where: { courseId: { in: courseIds } },
          _count: { userId: true },
        }),

        // 3. Tính số lần Enrollment đã hoàn thành (Completed)
        this.prisma.enrollment.count({
          where: {
            courseId: { in: courseIds },
            progress: { gte: 100 },
          },
        }),
      ]
    );

    const totalEnrollments = enrollmentStats._count.id || 0;
    const totalProgressSum = enrollmentStats._sum.progress || 0;

    // Tính tiến độ trung bình
    const averageProgress =
      totalEnrollments > 0
        ? parseFloat((totalProgressSum / totalEnrollments).toFixed(2))
        : 0;

    return {
      totalStudents: uniqueStudents.length,
      totalEnrollments,
      averageProgress,
      completedEnrollmentsCount: completedCount,
    };
  }
}
