import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import * as fs from "fs";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(
    dto: CreateLessonDto,
    instructorId?: number,
    video?: Express.Multer.File
  ) {
    // 🧩 Kiểm tra course có tồn tại và thuộc về instructor
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId, instructorId },
    });

    if (!course)
      throw new NotFoundException("Course not found or access denied");

    // 🧩 Upload video lên Cloudinary
    if (!video) throw new NotFoundException("Video file is required");

    // 🧩 Upload video lên Cloudinary (nếu có)
    let videoUrl: string | null = null;

    const uploaded = await this.cloudinaryService.uploadFile(
      video,
      "lessons",
      "video" //  phải chỉ định "video"
    );
    videoUrl = uploaded.secure_url;

    // 🧩 Tạo lesson
    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        videoUrl,
        orderIndex: dto.orderIndex ?? 0,
        courseId: dto.courseId,
      },
    });
  }

  async findAll() {
    return this.prisma.lesson.findMany({
      include: { course: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!lesson) throw new NotFoundException("Lesson not found");
    return lesson;
  }

  async getLessonsByCourse(courseId: number) {
    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });
  }

  async update(
    id: number,
    dto: UpdateLessonDto,
    instructorId: number,
    video?: Express.Multer.File
  ) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Lesson not found");

    const courseIdToCheck = dto.courseId ?? existing.courseId;

    const course = await this.prisma.course.findFirst({
      where: { id: courseIdToCheck, instructorId },
    });
    if (!course)
      throw new NotFoundException("Course not found or access denied");

    // 🧩 Kiểm tra trùng orderIndex
    if (
      dto.orderIndex !== undefined &&
      dto.orderIndex !== existing.orderIndex
    ) {
      const duplicate = await this.prisma.lesson.findFirst({
        where: {
          courseId: courseIdToCheck,
          orderIndex: dto.orderIndex,
          NOT: { id },
        },
      });
      if (duplicate) {
        throw new ConflictException(
          `Thứ tự ${dto.orderIndex} đã tồn tại trong khóa học này`
        );
      }
    }

    // 🧩 Upload video mới (nếu có)
    let videoUrl = existing.videoUrl;
    if (video) {
      const uploaded = await this.cloudinaryService.uploadFile(
        video,
        "lessons",
        "video" //  phải chỉ định "video"
      );
      videoUrl = uploaded.secure_url;
    }

    // 🧩 Cập nhật lesson
    return this.prisma.lesson.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        content: dto.content ?? existing.content,
        orderIndex: dto.orderIndex ?? existing.orderIndex,
        courseId: dto.courseId ?? existing.courseId,
        videoUrl,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Lesson not found");

    return this.prisma.lesson.delete({ where: { id } });
  }
}
