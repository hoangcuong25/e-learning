import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";
import { ApplicationStatus } from "@prisma/client";
import { SpecializationService } from "../specialization/specialization.service";

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly specializationService: SpecializationService
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    userId: number,
    thumbnail?: Express.Multer.File
  ) {
    const {
      title,
      description,
      price,
      isPublished,
      instructorId,
      specializationIds,
    } = createCourseDto;

    const approvedSpecializations =
      await this.specializationService.findByInstructorId(userId);

    if (!approvedSpecializations.length) {
      throw new ForbiddenException(
        "You must be an approved instructor to create a course."
      );
    }

    // Lấy danh sách chuyên môn được duyệt
    const approvedIds = approvedSpecializations.map((s) => s.id);

    // Kiểm tra chuyên môn hợp lệ
    const invalidIds = specializationIds.filter(
      (id) => !approvedIds.includes(id)
    );
    if (invalidIds.length > 0) {
      throw new ForbiddenException(
        `You can only assign approved specializations. Invalid IDs: ${invalidIds.join(", ")}`
      );
    }

    // Upload thumbnail lên Cloudinary

    let thumbnailUrl: string | undefined;

    // đẩy lên Cloudinar
    const uploaded = await this.cloudinaryService.uploadFile(thumbnail);
    thumbnailUrl = uploaded.url;

    // Tạo course trong DB
    const newCourse = await this.prisma.course.create({
      data: {
        title,
        description,
        price,
        isPublished,
        instructorId: userId,
        thumbnail: thumbnailUrl,
        specializations: {
          createMany: {
            data: specializationIds.map((id) => ({
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

  async findAll() {
    const courses = await this.prisma.course.findMany({
      include: {
        instructor: {
          select: { id: true, fullname: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      message: "Courses fetched successfully",
      data: courses,
    };
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
    updateCourseDto,
    thumbnail?: Express.Multer.File,
    userId?: number
  ) {
    const existing = await this.prisma.course.findUnique({
      where: { id, instructorId: userId },
    });
    if (!existing) throw new NotFoundException("Course not found");

    let updateData: any = { ...updateCourseDto };

    // Nếu có thumbnail mới, upload Cloudinary
    if (thumbnail) {
      const uploaded = await this.cloudinaryService.uploadFile(thumbnail);
      updateData.thumbnail = uploaded.url;
    }

    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const updated = await this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: { select: { id: true, fullname: true, email: true } },
      },
    });

    return {
      message: "Course updated successfully",
      data: updated,
    };
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
}
