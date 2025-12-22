import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

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

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, fullname: true, email: true },
        },
        lessons: {
          select: { id: true, title: true },
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

  async update(id: number, updateCourseDto, thumbnail?: Express.Multer.File) {
    const existing = await this.prisma.course.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Course not found");

    let updateData: any = { ...updateCourseDto };

    // Nếu có thumbnail mới, upload Cloudinary
    if (thumbnail) {
      const uploaded = await this.cloudinaryService.uploadFile(thumbnail);
      updateData.thumbnail = uploaded.url;
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

  async remove(id: number) {
    const existing = await this.prisma.course.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Course not found");

    await this.prisma.course.delete({ where: { id } });

    return {
      message: "Course deleted successfully",
      data: { id },
    };
  }

  async getCoursesByInstructor(instructorId: number) {
    return this.prisma.course.findMany({
      where: { instructorId }, // Lấy tất cả khóa học của instructor
      orderBy: { createdAt: "desc" }, // tuỳ chọn
    });
  }
}
