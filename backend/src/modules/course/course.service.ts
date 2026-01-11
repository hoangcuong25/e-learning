import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";
import { ApplicationStatus, CourseType, Prisma } from "@prisma/client";
import { SpecializationService } from "../specialization/specialization.service";
import { UpdateCourseDto } from "./dto/update-course.dto";
import {
  buildOrderBy,
  buildPaginationParams,
  buildPaginationResponse,
  buildSearchFilter,
} from "src/core/helpers/pagination.util";
import { PaginationQueryDto } from "src/core/dto/pagination-query.dto";
import { RedisService } from "src/core/redis/redis.service";

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly specializationService: SpecializationService,
    private readonly redisService: RedisService
  ) {}

  // 🧩 Tạo khóa học mới
  async create(
    createCourseDto: CreateCourseDto,
    instructorId: number,
    thumbnail?: Express.Multer.File
  ) {
    const { title, description, price, isPublished, specializationIds, type } =
      createCourseDto;

    // 🧩 Lấy danh sách chuyên ngành đã được duyệt của giảng viên
    const approvedSpecializations =
      await this.specializationService.findByInstructorId(instructorId);

    if (!approvedSpecializations.length) {
      throw new ForbiddenException(
        "Bạn cần được phê duyệt là giảng viên trước khi tạo khóa học."
      );
    }

    const approvedIds = approvedSpecializations.map((s) => s.id);

    // 🧩 Xử lý specializationIds (form-data có thể là 1 hoặc nhiều giá trị)
    let parsedSpecializationIds: number[] = [];

    if (specializationIds) {
      if (Array.isArray(specializationIds)) {
        parsedSpecializationIds = specializationIds.map((id) => Number(id));
      } else {
        parsedSpecializationIds = [Number(specializationIds)];
      }
    }

    // 🧩 Kiểm tra các chuyên ngành hợp lệ
    const invalidIds = parsedSpecializationIds.filter(
      (id) => !approvedIds.includes(id)
    );

    if (invalidIds.length > 0) {
      throw new ForbiddenException(
        `Bạn chỉ có thể chọn chuyên ngành đã được phê duyệt. ID không hợp lệ: ${invalidIds.join(
          ", "
        )}`
      );
    }

    // 🧩 Upload ảnh bìa lên Cloudinary (nếu có)
    let thumbnailUrl: string | undefined = undefined;
    if (thumbnail) {
      const uploaded = await this.cloudinaryService.uploadFile(thumbnail);
      thumbnailUrl = uploaded.url;
    }

    // 🧩 Tạo khóa học trong cơ sở dữ liệu
    const newCourse = await this.prisma.course.create({
      data: {
        title,
        description,
        price: type === "FREE" ? 0 : Number(price ?? 0),
        isPublished: isPublished ?? false,
        instructorId,
        thumbnail: thumbnailUrl,
        type: (type as any) ?? CourseType.FREE,
        specializations: {
          createMany: {
            data: parsedSpecializationIds.map((id) => ({
              specializationId: id,
            })),
          },
        },
      },
      include: {
        instructor: {
          select: { id: true, fullname: true, email: true },
        },
        specializations: {
          include: {
            specialization: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    return {
      message: "Tạo khóa học thành công.",
      course: newCourse,
    };
  }

  // 🧩 Lấy danh sách khóa học (phân trang + tìm kiếm)
  async findAll(dto: PaginationQueryDto, userId: number) {
    const { skip, take, page, limit } = buildPaginationParams(dto);
    const orderBy = buildOrderBy(dto);
    const where =
      buildSearchFilter<Prisma.CourseWhereInput>(dto, [
        "title",
        "description",
      ]) || {};

    where.deletedAt = null;

    if (dto.specialization) {
      where.specializations = {
        some: {
          specialization: {
            name: dto.specialization,
          },
        },
      };
    }

    const now = new Date();

    const [courses, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          instructor: {
            select: { id: true, fullname: true, avatar: true },
          },

          _count: {
            select: {
              chapter: true,
            },
          },

          specializations: {
            include: {
              specialization: {
                select: { name: true },
              },
            },
          },

          // check enrollment của user
          ...(userId && {
            enrollments: {
              where: {
                userId,
              },
              select: {
                id: true,
                progress: true,
                enrolledAt: true,
                completedAt: true,
              },
            },
          }),

          coupon: {
            where: {
              isActive: true,
              AND: [
                { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
                { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
              ],
            },
          },
        },
      }),

      this.prisma.course.count({ where }),
    ]);

    // Map ra field isEnrolled
    const mappedCourses = courses.map((course) => ({
      ...course,
      isEnrolled: Boolean(course.enrollments?.length),
    }));

    return {
      message: "Lấy danh sách khóa học thành công.",
      ...buildPaginationResponse(mappedCourses, total, page, limit),
    };
  }

  // 🧩 Lấy khóa học theo ID
  async findCourseById(id: number) {
    const cacheKey = `course:detail:${id}`;

    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        const course = await this.prisma.course.findFirst({
          where: { id, deletedAt: null },
          include: {
            instructor: {
              select: { id: true, fullname: true, email: true, avatar: true },
            },
            specializations: {
              include: {
                specialization: {
                  select: { name: true },
                },
              },
            },
            chapter: {
              orderBy: { orderIndex: "asc" },
              include: {
                lessons: {
                  orderBy: { orderIndex: "asc" },
                  select: {
                    id: true,
                    title: true,
                    orderIndex: true,
                    content: true,
                    duration: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
          },
        });

        if (!course) {
          throw new NotFoundException("Không tìm thấy khóa học.");
        }

        return course;
      },
      600 // 10 minutes TTL
    );
  }

  // 🧩 Lấy chi tiết khóa học (bao gồm chương, bài học, chuyên ngành)
  async findOne(id: number, userId: number) {
    // Query database để lấy role của user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) throw new NotFoundException("Không tìm thấy người dùng.");

    // Nếu là ADMIN thì có thể xem bất kỳ khóa học nào
    const whereCondition: any = { id, deletedAt: null };

    // Nếu không phải ADMIN thì chỉ được xem khóa học của mình
    if (user.role !== "ADMIN") {
      whereCondition.instructorId = userId;
    }

    const course = await this.prisma.course.findFirst({
      where: whereCondition,
      include: {
        instructor: {
          select: { id: true, fullname: true, email: true, avatar: true },
        },
        _count: {
          select: {
            enrollments: true,
            courseRating: true,
          },
        },
        chapter: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                orderIndex: true,
                videoUrl: true,
                content: true,
                duration: true,
                createdAt: true,
                updatedAt: true,
                quizzes: {
                  include: {
                    questions: {
                      include: {
                        options: true,
                      },
                    },
                  },
                },
              },
              orderBy: { orderIndex: "asc" },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        specializations: {
          include: {
            specialization: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!course) {
      return { message: "Không tìm thấy khóa học.", data: null };
    }

    return { message: "Lấy thông tin khóa học thành công.", data: course };
  }

  // 🧩 Cập nhật khóa học
  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
    thumbnail?: Express.Multer.File,
    userId?: number
  ) {
    // Kiểm tra khóa học thuộc giảng viên hiện tại
    const existing = await this.prisma.course.findUnique({
      where: { id, instructorId: userId },
    });
    if (!existing) throw new NotFoundException("Không tìm thấy khóa học.");

    const updateData: any = {};

    // Upload ảnh bìa mới (nếu có)
    if (thumbnail) {
      // Xóa ảnh cũ trên Cloudinary (nếu có)
      if (existing.thumbnail) {
        try {
          // Extract public_id từ URL Cloudinary
          const urlParts = existing.thumbnail.split("/");
          const fileNameWithExt = urlParts[urlParts.length - 1];
          const fileName = fileNameWithExt.split(".")[0];
          const folder = urlParts[urlParts.length - 2];
          const publicId = `${folder}/${fileName}`;

          await this.cloudinaryService.deleteFile(publicId, "image");
        } catch (error) {
          console.error("Error deleting old thumbnail:", error);
        }
      }

      const uploaded = await this.cloudinaryService.uploadFile(thumbnail);
      updateData.thumbnail = uploaded.url;
    }

    // Gán các trường được cập nhật
    if (updateCourseDto.title) updateData.title = updateCourseDto.title;
    if (updateCourseDto.description)
      updateData.description = updateCourseDto.description;
    if (updateCourseDto.isPublished !== undefined) {
      const isPublished =
        String(updateCourseDto.isPublished) === "true" ? true : false;
      updateData.isPublished = isPublished;
    }
    if (updateCourseDto.type) updateData.type = updateCourseDto.type;

    // Nếu là khóa học miễn phí → giá = 0
    if (updateCourseDto.type === "FREE") {
      updateData.price = 0;
    } else if (updateCourseDto.price !== undefined) {
      updateData.price = Number(updateCourseDto.price);
    }

    // Xử lý danh sách chuyên ngành
    let specializationIds: number[] = [];

    if (updateCourseDto.specializationIds) {
      if (!Array.isArray(updateCourseDto.specializationIds)) {
        specializationIds = [Number(updateCourseDto.specializationIds)];
      } else {
        specializationIds = updateCourseDto.specializationIds.map((id) =>
          Number(id)
        );
      }
    }

    // Nếu có chuyên ngành mới
    if (specializationIds.length > 0) {
      await this.prisma.courseSpecialization.deleteMany({
        where: { courseId: id },
      });

      const updated = await this.prisma.course.update({
        where: { id },
        data: {
          ...updateData,
          specializations: {
            create: specializationIds.map((spId) => ({
              specialization: { connect: { id: spId } },
            })),
          },
        },
        include: {
          specializations: { include: { specialization: true } },
        },
      });

      // Invalidate caches
      await this.redisService.del(`course:detail:${id}`);
      await this.redisService.delPattern("course:popular:*");

      return { message: "Cập nhật khóa học thành công.", data: updated };
    }

    // Nếu không thay đổi chuyên ngành
    const updated = await this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        specializations: { include: { specialization: true } },
      },
    });

    // Invalidate caches
    await this.redisService.del(`course:detail:${id}`);
    await this.redisService.delPattern("course:popular:*");

    return { message: "Cập nhật khóa học thành công.", data: updated };
  }

  // 🧩 Xóa khóa học (Soft Delete)
  async remove(id: number, userId: number) {
    // Lấy thông tin khóa học
    const existing = await this.prisma.course.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(
        "Không tìm thấy khóa học hoặc khóa học đã bị xóa."
      );
    }

    // Query database để lấy role của user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) throw new NotFoundException("Không tìm thấy người dùng.");

    // Nếu không phải ADMIN thì kiểm tra quyền sở hữu
    if (user.role !== "ADMIN" && existing.instructorId !== userId) {
      throw new ForbiddenException("Bạn không có quyền xóa khóa học này.");
    }

    // Soft delete: chỉ cập nhật deletedAt thay vì xóa thật
    const result = await this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Invalidate caches
    await this.redisService.del(`course:detail:${id}`);
    await this.redisService.delPattern("course:popular:*");

    return result;
  }

  // 🧩 Lấy danh sách khóa học của giảng viên
  async getCoursesByInstructor(instructorId: number) {
    return this.prisma.course.findMany({
      where: { instructorId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        specializations: {
          include: {
            specialization: {
              select: { id: true, name: true },
            },
          },
        },
        chapter: {
          include: {
            lessons: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });
  }

  async getPopularCourses(limit: number = 6) {
    const cacheKey = `course:popular:${limit}`;

    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        return this.prisma.course.findMany({
          where: { isPublished: true, deletedAt: null },
          orderBy: { viewCount: "desc" },
          take: limit,
          include: {
            instructor: {
              select: { fullname: true, avatar: true },
            },
          },
        });
      },
      900 // 15 minutes TTL
    );
  }

  // 🧩 Tăng lượt xem khóa học
  async increaseView(courseId: number, userId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) throw new NotFoundException("Không tìm thấy khóa học.");

    // Nếu người dùng đã xem trong 3 giờ qua thì bỏ qua
    const recentView = await this.prisma.courseView.findFirst({
      where: {
        courseId,
        userId,
        viewedAt: { gte: new Date(Date.now() - 10_800_000) },
      },
    });

    if (recentView) {
      return { message: "Lượt xem đã được tính gần đây." };
    }

    // Ghi nhận lượt xem
    await this.prisma.courseView.create({
      data: { courseId, userId: userId ?? null },
    });

    // Cập nhật bộ đếm tổng
    await this.prisma.course.update({
      where: { id: courseId },
      data: { viewCount: { increment: 1 } },
    });

    return { message: "Tăng lượt xem thành công." };
  }

  async getCourseDetail(courseId: number, userId?: number) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, deletedAt: null },
      include: {
        instructor: {
          select: { id: true, fullname: true, avatar: true },
        },
        specializations: {
          include: { specialization: true },
        },
        chapter: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
              include: {
                quizzes: {
                  include: {
                    questions: {
                      include: {
                        options: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        courseRating: {
          select: { rating: true },
        },
        enrollments: {
          where: { userId },
          select: { id: true, progress: true, enrolledAt: true },
        },
        lessonProgresses: {
          where: {
            userId,
            isCompleted: true,
          },
          select: {
            isCompleted: true,
            id: true,
            lessonId: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    return course;
  }
}
