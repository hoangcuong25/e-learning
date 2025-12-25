import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";
import { ApplicationStatus, CourseType } from "@prisma/client";
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

  async create(
    createCourseDto: CreateCourseDto,
    instructorId: number,
    thumbnail?: Express.Multer.File
  ) {
    const { title, description, price, isPublished, specializationIds, type } =
      createCourseDto;

    // 🧩 Lấy danh sách chuyên môn được duyệt
    const approvedSpecializations =
      await this.specializationService.findByInstructorId(instructorId);

    if (!approvedSpecializations.length) {
      throw new ForbiddenException(
        "You must be an approved instructor to create a course."
      );
    }

    const approvedIds = approvedSpecializations.map((s) => s.id);

    // 🧩 Xử lý specializationIds: vì form-data có thể là 1 giá trị hoặc nhiều
    let parsedSpecializationIds: number[] = [];

    if (specializationIds) {
      if (Array.isArray(specializationIds)) {
        parsedSpecializationIds = specializationIds.map((id) => Number(id));
      } else {
        parsedSpecializationIds = [Number(specializationIds)];
      }
    }

    // 🧩 Kiểm tra chuyên ngành hợp lệ
    const invalidIds = parsedSpecializationIds.filter(
      (id) => !approvedIds.includes(id)
    );

    if (invalidIds.length > 0) {
      throw new ForbiddenException(
        `You can only assign approved specializations. Invalid IDs: ${invalidIds.join(", ")}`
      );
    }

    // 🧩 Upload thumbnail lên Cloudinary (nếu có)
    let thumbnailUrl: string | undefined = undefined;
    if (thumbnail) {
      const uploaded = await this.cloudinaryService.uploadFile(thumbnail);
      thumbnailUrl = uploaded.url;
    }

    // 🧩 Tạo course trong DB
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
      message: "Course created successfully.",
      course: newCourse,
    };
  }

  async findAll(dto: PaginationQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(dto);
    const orderBy = buildOrderBy(dto);
    const where = buildSearchFilter(dto, ["title", "description"]); // các field cho phép tìm kiếm

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
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      message: "Courses fetched successfully",
      ...buildPaginationResponse(courses, total, page, limit),
    };
  }

  findCourseById(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, fullname: true, email: true },
        },
      },
    });
  }

  async findOne(id: number, instructorId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id, instructorId },
      include: {
        instructor: {
          select: { id: true, fullname: true, email: true },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
            videoUrl: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
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
      return {
        message: "Course not found",
        data: null,
      };
    }

    return {
      message: "Course fetched successfully",
      data: course,
    };
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
    thumbnail?: Express.Multer.File,
    userId?: number
  ) {
    // Kiểm tra khoá học thuộc về giảng viên hiện tại
    const existing = await this.prisma.course.findUnique({
      where: { id, instructorId: userId },
    });
    if (!existing) throw new NotFoundException("Course not found");

    // Tạo object cập nhật
    const updateData: any = {};

    // Nếu có thumbnail mới, upload Cloudinary
    if (thumbnail) {
      const uploaded = await this.cloudinaryService.uploadFile(thumbnail);
      updateData.thumbnail = uploaded.url;
    }

    // Map các trường từ DTO nếu có giá trị
    if (updateCourseDto.title) updateData.title = updateCourseDto.title;
    if (updateCourseDto.description)
      updateData.description = updateCourseDto.description;
    if (updateCourseDto.isPublished !== undefined)
      updateData.isPublished = updateCourseDto.isPublished;
    if (updateCourseDto.type) updateData.type = updateCourseDto.type;

    // Logic: nếu type = FREE → set giá về 0
    if (updateCourseDto.type === "FREE") {
      updateData.price = 0;
    } else if (updateCourseDto.price !== undefined) {
      updateData.price = Number(updateCourseDto.price);
    }

    // Xử lý specializationIds (form-data có thể gửi 1 hoặc nhiều giá trị)
    let specializationIds: number[] = [];

    if (updateCourseDto.specializationIds) {
      // Chuyển về mảng số
      if (!Array.isArray(updateCourseDto.specializationIds)) {
        specializationIds = [Number(updateCourseDto.specializationIds)];
      } else {
        specializationIds = updateCourseDto.specializationIds.map((id) =>
          Number(id)
        );
      }
    }

    // ── Nếu có specialization mới ───────────────────────────
    if (specializationIds.length > 0) {
      // Xoá liên kết cũ
      await this.prisma.courseSpecialization.deleteMany({
        where: { courseId: id },
      });

      // Cập nhật lại course + liên kết specialization mới
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

      return { message: "Course updated successfully", data: updated };
    }

    // ── Nếu không có specializationIds → chỉ cập nhật dữ liệu cơ bản ──
    const updated = await this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        specializations: { include: { specialization: true } },
      },
    });

    return { message: "Course updated successfully", data: updated };
  }

  async remove(id: number, userId: number) {
    const existing = await this.prisma.course.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Course not found");

    return await this.prisma.course.delete({
      where: { id, instructorId: userId },
    });
  }

  async getCoursesByInstructor(instructorId: number) {
    return this.prisma.course.findMany({
      where: { instructorId },
      orderBy: { createdAt: "desc" },
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
          },
          orderBy: { orderIndex: "asc" }, // Sắp xếp bài học trong khoá học
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
  }

  async rateCourse(id: number, rating: number, userId: number) {
    // Kiểm tra khoá học tồn tại
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException("Course not found");

    // Tạo đánh giá
    const newRating = await this.prisma.courseRating.create({
      data: {
        courseId: id,
        userId,
        rating,
      },
    });
    return {
      message: "Course rated successfully",
      data: newRating,
    };
  }

  async increaseView(courseId: number, userId?: number) {
    // Kiểm tra xem khóa học có tồn tại không
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    // Kiểm tra nếu user đã xem trong 1 giờ gần đây thì bỏ qua
    if (userId) {
      const recentView = await this.prisma.courseView.findFirst({
        where: {
          courseId,
          userId,
          viewedAt: {
            gte: new Date(Date.now() - 3600_000), // 1 giờ
          },
        },
      });

      if (recentView) {
        return { message: "View already counted recently" };
      }
    }

    // Ghi lại lượt xem
    await this.prisma.courseView.create({
      data: {
        courseId,
        userId: userId ?? null,
      },
    });

    // Cập nhật bộ đếm tổng
    await this.prisma.course.update({
      where: { id: courseId },
      data: { viewCount: { increment: 1 } },
    });

    return { message: "View counted successfully" };
  }
}
