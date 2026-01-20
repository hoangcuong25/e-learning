import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    thumbnail?: Express.Multer.File
  ) {
    const { title, description, price, isPublished, instructorId } =
      createCourseDto;

    let thumbnailUrl: string | undefined;

    // đẩy lên Cloudinar
    const uploaded = await this.cloudinaryService.uploadFile(thumbnail);
    thumbnailUrl = uploaded.url;

    // Tạo course trong DB
    return await this.prisma.course.create({
      data: {
        title,
        description,
        price,
        isPublished,
        instructorId,
        thumbnail: thumbnailUrl,
      },
      include: {
        instructor: {
          select: { id: true, fullname: true, email: true },
        },
      },
    });
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
