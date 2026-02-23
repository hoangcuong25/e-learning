import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class AdminAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [totalUsers, totalInstructors, totalCourses, totalSpecializations] =
      await Promise.all([
        // Total users
        this.prisma.user.count({
          where: {
            role: "USER",
          },
        }),

        // Total instructors
        this.prisma.user.count({
          where: {
            role: "INSTRUCTOR",
          },
        }),

        // Total courses (chưa bị soft delete)
        this.prisma.course.count({
          where: {
            deletedAt: null,
          },
        }),

        // Total specializations
        this.prisma.specialization.count(),
      ]);

    return {
      totalUsers,
      totalInstructors,
      totalCourses,
      totalSpecializations,
    };
  }
}
