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

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly specializationService: SpecializationService
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
  async findAll(dto: PaginationQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(dto);
    const orderBy = buildOrderBy(dto);
    const where =
      buildSearchFilter<Prisma.CourseWhereInput>(dto, [
        "title",
        "description",
      ]) || {};

    // Nếu có specializationId thì filter theo đó
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
            select: { id: true, fullname: true, email: true },
          },
          specializations: {
            include: {
              specialization: {
                select: { name: true },
              },
            },
          },
          coupon: {
            where: {
              isActive: true,
              OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
            },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      message: "Lấy danh sách khóa học thành công.",
      ...buildPaginationResponse(courses, total, page, limit),
    };
  }

  // 🧩 Lấy khóa học theo ID
  async findCourseById(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, fullname: true, email: true },
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
  }

  // 🧩 Lấy chi tiết khóa học (bao gồm chương, bài học, chuyên ngành)
  async findOne(id: number, instructorId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id, instructorId },
      include: {
        instructor: {
          select: { id: true, fullname: true, email: true },
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
      const uploaded = await this.cloudinaryService.uploadFile(thumbnail);
      updateData.thumbnail = uploaded.url;
    }

    // Gán các trường được cập nhật
    if (updateCourseDto.title) updateData.title = updateCourseDto.title;
    if (updateCourseDto.description)
      updateData.description = updateCourseDto.description;
    if (updateCourseDto.isPublished !== undefined)
      updateData.isPublished = updateCourseDto.isPublished;
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

    return { message: "Cập nhật khóa học thành công.", data: updated };
  }

  // 🧩 Xóa khóa học
  async remove(id: number, userId: number) {
    const existing = await this.prisma.course.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Không tìm thấy khóa học.");

    return await this.prisma.course.delete({
      where: { id, instructorId: userId },
    });
  }

  // 🧩 Lấy danh sách khóa học của giảng viên
  async getCoursesByInstructor(instructorId: number) {
    return this.prisma.course.findMany({
      where: { instructorId },
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

  // 🧩 Đánh giá khóa học
  async rateCourse(id: number, rating: number, userId: number) {
    // 1. Kiểm tra khóa học có tồn tại không
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException("Không tìm thấy khóa học.");
    }

    // Đảm bảo rating hợp lệ (1-5)
    if (rating < 1 || rating > 5) {
      throw new BadRequestException(
        "Giá trị đánh giá phải nằm trong khoảng từ 1 đến 5."
      );
    }

    // Khai báo biến để trả về
    let data: any;
    let message: string;

    const result = await this.prisma.$transaction(async (prisma) => {
      // 2. Kiểm tra xem user này đã rating khóa học này chưa
      const existingRating = await prisma.courseRating.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: id,
          },
        },
      });

      let currentTotalRating = course.totalRating;
      let currentSumOfRatings = course.averageRating * course.totalRating;

      if (existingRating) {
        // User đã rate: Cập nhật rating
        const oldRatingValue = existingRating.rating;

        if (oldRatingValue === rating) {
          // Tránh cập nhật nếu rating không đổi
          message = "Đánh giá không thay đổi.";
          data = existingRating;
          // Return sớm khỏi transaction nếu không có thay đổi
          return { message, data };
        }

        data = await prisma.courseRating.update({
          where: { id: existingRating.id },
          data: { rating: rating },
        });
        message = "Cập nhật đánh giá khóa học thành công.";

        // Cập nhật Tổng điểm: Trừ điểm cũ và cộng điểm mới
        currentSumOfRatings = currentSumOfRatings - oldRatingValue + rating;
      } else {
        // User chưa rate: Tạo rating mới
        data = await prisma.courseRating.create({
          data: { courseId: id, userId, rating },
        });
        message = "Đánh giá khóa học thành công.";

        // Cập nhật Tổng điểm và Tổng số lượt đánh giá
        currentSumOfRatings += rating;
        currentTotalRating += 1;
      }

      // 3. Tính toán lại averageRating và totalRating

      const newAverageRating =
        currentTotalRating > 0 ? currentSumOfRatings / currentTotalRating : 0;

      // Cập nhật thông tin khóa học
      const updatedCourse = await prisma.course.update({
        where: { id },
        data: {
          // Làm tròn đến 2 chữ số thập phân trước khi lưu
          averageRating: parseFloat(newAverageRating.toFixed(2)),
          totalRating: currentTotalRating, // Cập nhật totalRating
        },
      });

      return {
        message: message,
        data: {
          rating: data,
          courseInfo: updatedCourse,
        },
      };
    });

    return result;
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
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
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
