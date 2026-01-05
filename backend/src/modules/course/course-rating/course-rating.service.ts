import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateRatingDto } from "./dto/create-course-rating.dto";
import { UpdateRatingDto } from "./dto/update-course-rating.dto";
import {
  buildOrderBy,
  buildPaginationParams,
  buildPaginationResponse,
} from "src/core/helpers/pagination.util";

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRatingDto, userId: number) {
    const { courseId, rating, text } = dto;

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        enrollments: {
          where: { userId },
          select: { id: true },
        },
      },
    });
    if (!course) throw new NotFoundException("Course not found");

    // Check if user is enrolled in the course
    if (course.enrollments.length === 0) {
      throw new BadRequestException(
        "You must be enrolled in this course to rate it"
      );
    }

    if (rating < 1 || rating > 5)
      throw new BadRequestException("Rating must be between 1–5");

    if (!text.trim())
      throw new BadRequestException("Rating text cannot be empty");

    const result = await this.prisma.$transaction(async (prisma) => {
      const existing = await prisma.courseRating.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      let ratingRecord;
      if (existing) {
        ratingRecord = await prisma.courseRating.update({
          where: { id: existing.id },
          data: { rating, text },
        });
      } else {
        ratingRecord = await prisma.courseRating.create({
          data: { userId, courseId, rating, text },
        });
      }

      // Recalculate course rating
      const agg = await prisma.courseRating.aggregate({
        _avg: { rating: true },
        _count: { rating: true },
        where: { courseId },
      });

      await prisma.course.update({
        where: { id: courseId },
        data: {
          averageRating: parseFloat((agg._avg.rating ?? 0).toFixed(2)),
          totalRating: agg._count.rating,
        },
      });

      return ratingRecord;
    });

    return { message: "Rating saved", data: result };
  }

  async findAll(courseId: number, page = 1, limit = 10) {
    const paginationParams = buildPaginationParams({ page, limit });
    const orderByParams = buildOrderBy({});

    const baseWhere = { courseId };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.courseRating.findMany({
        where: baseWhere,
        include: {
          user: { select: { id: true, fullname: true, avatar: true } },
        },
        orderBy: orderByParams,
        skip: paginationParams.skip,
        take: paginationParams.take,
      }),
      this.prisma.courseRating.count({ where: baseWhere }),
    ]);

    return buildPaginationResponse(
      items,
      total,
      paginationParams.page,
      paginationParams.limit
    );
  }

  async findOne(id: number) {
    const rating = await this.prisma.courseRating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException("Rating not found");
    return rating;
  }

  async update(id: number, dto: UpdateRatingDto, userId: number) {
    // Find the rating and verify ownership
    const existingRating = await this.prisma.courseRating.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            enrollments: {
              where: { userId },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!existingRating) {
      throw new NotFoundException("Rating not found");
    }

    // Check if the user owns this rating
    if (existingRating.userId !== userId) {
      throw new BadRequestException("You can only update your own ratings");
    }

    // Check if user is still enrolled
    if (existingRating.course.enrollments.length === 0) {
      throw new BadRequestException(
        "You must be enrolled in this course to update the rating"
      );
    }

    const rating = await this.prisma.courseRating.update({
      where: { id },
      data: dto,
    });
    return rating;
  }

  async remove(id: number, userId: number) {
    // Find the rating and verify ownership
    const existingRating = await this.prisma.courseRating.findUnique({
      where: { id },
    });

    if (!existingRating) {
      throw new NotFoundException("Rating not found");
    }

    // Check if the user owns this rating
    if (existingRating.userId !== userId) {
      throw new BadRequestException("You can only delete your own ratings");
    }

    await this.prisma.courseRating.delete({ where: { id } });
    return { message: "Rating deleted" };
  }
}
