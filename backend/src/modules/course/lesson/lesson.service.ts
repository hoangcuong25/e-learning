import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import * as fs from "fs";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";
import { EnrollmentService } from "src/modules/enrollment/enrollment.service";

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private enrollmentService: EnrollmentService
  ) {}

  // 🧩 Tạo bài học mới
  async create(dto: CreateLessonDto, instructorId?: number) {
    // 🧩 Kiểm tra chapter tồn tại và thuộc khóa học của giảng viên
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: dto.chapterId },
      include: { course: true },
    });

    if (!chapter || chapter.course.instructorId !== instructorId) {
      throw new NotFoundException(
        "Không tìm thấy chương hoặc không có quyền truy cập"
      );
    }

    // 🧩 Kiểm tra trùng orderIndex trong cùng 1 chapter
    if (dto.orderIndex !== undefined && dto.orderIndex !== null) {
      const existingLesson = await this.prisma.lesson.findFirst({
        where: {
          chapterId: dto.chapterId,
          orderIndex: dto.orderIndex,
        },
      });

      if (existingLesson) {
        throw new BadRequestException(
          `Thứ tự ${dto.orderIndex} đã tồn tại trong chương này`
        );
      }
    }

    // 🧩 Kiểm tra có video không
    if (!dto.videoUrl) throw new NotFoundException("Cần phải có video url");

    // 🧩 Tạo bài học
    const newLesson = await this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        videoUrl: dto.videoUrl,
        orderIndex: dto.orderIndex ?? 0,
        duration: dto.duration ?? 0, // Lưu thời lượng (giây)
        chapterId: dto.chapterId,
      },
    });
    // 🧩 Cập nhật tổng thời lượng của course (cộng thêm duration của lesson mới)
    await this.prisma.course.update({
      where: { id: chapter.courseId },
      data: {
        duration: {
          increment: dto.duration ?? 0,
        },
      },
    });

    return newLesson;
  }

  // 🧩 Lấy tất cả bài học
  async findAll() {
    return this.prisma.lesson.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // 🧩 Lấy bài học theo ID
  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException("Không tìm thấy bài học");
    return lesson;
  }

  // 🧩 Lấy danh sách bài học theo khóa học của giảng viên
  async getLessonsByCourse(courseId: number, instructorId: number) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, instructorId },
    });

    if (!course)
      throw new ForbiddenException(
        "Bạn không có quyền truy cập vào khóa học này"
      );

    const lessons = await this.prisma.lesson.findMany({
      where: { chapter: { courseId } },
      orderBy: { orderIndex: "asc" },
      include: {
        quizzes: {
          include: {
            _count: { select: { questions: true } },
          },
        },
        chapter: true,
      },
    });

    return {
      message: "Lấy danh sách bài học thành công",
      data: lessons,
    };
  }

  // 🧩 Cập nhật bài học
  async update(id: number, dto: UpdateLessonDto, instructorId: number) {
    const existing = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: { course: true },
        },
      },
    });

    if (!existing) throw new NotFoundException("Không tìm thấy bài học");
    if (existing.chapter.course.instructorId !== instructorId)
      throw new ForbiddenException("Bạn không có quyền cập nhật bài học này");

    // 🧩 Kiểm tra trùng orderIndex
    if (
      dto.orderIndex !== undefined &&
      dto.orderIndex !== existing.orderIndex
    ) {
      const duplicate = await this.prisma.lesson.findFirst({
        where: {
          chapterId: existing.chapterId,
          orderIndex: dto.orderIndex,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new ConflictException(
          `Thứ tự ${dto.orderIndex} đã tồn tại trong chương này`
        );
      }
    }

    // 🧩 Xử lý video & duration
    let videoUrl = existing.videoUrl;
    let duration = existing.duration;
    let durationChanged = false;

    if (dto.videoUrl && dto.videoUrl !== existing.videoUrl) {
      // Xóa video cũ trên Cloudinary (nếu có)
      if (existing.videoUrl) {
        try {
          // Extract public_id từ URL Cloudinary
          const urlParts = existing.videoUrl.split("/");
          const fileNameWithExt = urlParts[urlParts.length - 1];
          const fileName = fileNameWithExt.split(".")[0];
          const folder = urlParts[urlParts.length - 2];
          const publicId = `${folder}/${fileName}`;

          await this.cloudinaryService.deleteFile(publicId, "video");
        } catch (error) {
          console.error("Error deleting old video:", error);
        }
      }

      videoUrl = dto.videoUrl;
      duration = dto.duration;
      durationChanged = true;
    }

    // 🧩 Update lesson
    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        content: dto.content ?? existing.content,
        orderIndex: dto.orderIndex ?? existing.orderIndex,
        videoUrl,
        duration,
      },
    });

    // 🧩 Nếu duration lesson thay đổi → update course.duration
    if (durationChanged) {
      const courseId = existing.chapter.course.id;

      const oldDuration = existing.duration ?? 0;
      const newDuration = duration ?? 0;

      const updatedCourseDuration =
        existing.chapter.course.duration - oldDuration + newDuration;

      await this.prisma.course.update({
        where: { id: courseId },
        data: {
          duration: Math.max(updatedCourseDuration, 0),
        },
      });
    }

    return {
      message: "Cập nhật bài học thành công",
      data: updatedLesson,
    };
  }

  // 🧩 Xóa bài học
  async remove(id: number) {
    const existing = await this.prisma.lesson.findUnique({
      where: { id },
      include: { chapter: { include: { course: true } } },
    });
    if (!existing) throw new NotFoundException("Không tìm thấy bài học");

    // 🧩 Cập nhật tổng thời lượng của course
    await this.prisma.course.update({
      where: { id: existing.chapter.courseId },
      data: {
        duration: {
          decrement: existing.duration,
        },
      },
    });

    return this.prisma.lesson.delete({ where: { id } });
  }

  async markLessonCompleted(lessonId: number, userId: number) {
    // 1. Kiểm tra User có được Enroll vào Course chứa Lesson này không

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { chapter: { select: { courseId: true } } },
    });

    const courseId = lesson?.chapter?.courseId;
    if (!courseId) {
      throw new NotFoundException(
        `Lesson with ID ${lessonId} not found or not linked to a course.`
      );
    }

    const isEnrollment = this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (!isEnrollment) {
      throw new NotFoundException(`Some thing wrong.`);
    }

    // 2. Upsert (Tạo hoặc Cập nhật) LessonProgress
    const updatedProgress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        courseId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // 3. Kích hoạt logic tính toán tiến độ Enrollment
    await this.enrollmentService.recalculateProgress(userId, courseId);

    return updatedProgress;
  }
}
