import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import { PrismaService } from "src/core/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ChapterService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Tạo chương mới ─────────────────────────────
  async create(courseId: number, dto: CreateChapterDto, instructorId: number) {
    try {
      // Kiểm tra khóa học có tồn tại và thuộc giảng viên này không
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });
      if (!course) throw new NotFoundException("Không tìm thấy khóa học");
      if (course.instructorId !== instructorId)
        throw new ForbiddenException(
          "Bạn không phải là giảng viên của khóa học này"
        );

      // Kiểm tra trùng orderIndex trong cùng khóa học
      if (dto.orderIndex !== undefined && dto.orderIndex !== null) {
        const existingChapter = await this.prisma.chapter.findFirst({
          where: {
            courseId,
            orderIndex: dto.orderIndex,
          },
        });

        if (existingChapter) {
          throw new BadRequestException(
            `Thứ tự ${dto.orderIndex} đã tồn tại trong khóa học này`
          );
        }
      }

      const chapter = await this.prisma.chapter.create({
        data: {
          title: dto.title,
          description: dto.description,
          courseId,
          orderIndex: dto.orderIndex ?? 0,
          duration: 0,
        },
      });

      return {
        message: "Tạo chương thành công",
        data: chapter,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ── Lấy tất cả các chương ─────────────────────
  async findAll(courseId: number) {
    const chapters = await this.prisma.chapter.findMany({
      where: { courseId },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            duration: true,
          },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    // Tính tổng thời lượng mỗi chương
    const withDuration = chapters.map((chapter) => {
      const totalDuration = chapter.lessons.reduce(
        (sum, l) => sum + (l.duration ?? 0),
        0
      );
      return { ...chapter, totalDuration };
    });

    return {
      message: "Lấy danh sách chương thành công",
      data: withDuration,
    };
  }

  // ── Lấy chi tiết một chương ───────────────────
  async findOne(courseId: number, id: number) {
    const chapter = await this.prisma.chapter.findFirst({
      where: { id, courseId },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            duration: true,
          },
        },
      },
    });
    if (!chapter) throw new NotFoundException("Không tìm thấy chương");

    const totalDuration = chapter.lessons.reduce(
      (sum, l) => sum + (l.duration ?? 0),
      0
    );

    return {
      message: "Lấy chi tiết chương thành công",
      data: { ...chapter, totalDuration },
    };
  }

  // ── Cập nhật chương ───────────────────────────
  async update(
    courseId: number,
    id: number,
    dto: UpdateChapterDto,
    instructorId: number
  ) {
    const chapter = await this.prisma.chapter.findFirst({
      where: { id, courseId },
      include: { course: true },
    });

    if (!chapter) throw new NotFoundException("Không tìm thấy chương");
    if (chapter.course.instructorId !== instructorId)
      throw new ForbiddenException("Bạn không có quyền cập nhật chương này");

    // Kiểm tra trùng orderIndex trong cùng khóa học nếu có gửi orderIndex mới
    if (
      dto.orderIndex !== undefined &&
      dto.orderIndex !== null &&
      dto.orderIndex !== chapter.orderIndex
    ) {
      const existingChapter = await this.prisma.chapter.findFirst({
        where: {
          courseId,
          orderIndex: dto.orderIndex,
          NOT: { id }, // loại trừ chương đang update
        },
      });

      if (existingChapter) {
        throw new BadRequestException(
          `Thứ tự ${dto.orderIndex} đã tồn tại trong khóa học này`
        );
      }
    }

    const updated = await this.prisma.chapter.update({
      where: { id },
      data: {
        title: dto.title ?? chapter.title,
        description: dto.description ?? chapter.description,
        orderIndex: dto.orderIndex ?? chapter.orderIndex,
        duration: chapter.duration,
      },
    });

    return {
      message: "Cập nhật chương thành công",
      data: updated,
    };
  }

  // ── Xóa chương ────────────────────────────────
  async remove(courseId: number, id: number, instructorId: number) {
    const chapter = await this.prisma.chapter.findFirst({
      where: { id, courseId },
      include: { course: true },
    });

    if (!chapter) throw new NotFoundException("Không tìm thấy chương");
    if (chapter.course.instructorId !== instructorId)
      throw new ForbiddenException("Bạn không có quyền xóa chương này");

    await this.prisma.chapter.delete({ where: { id } });

    return {
      message: "Xóa chương thành công",
    };
  }
}
